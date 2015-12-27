(function() {
  'use strict';

  angular.module('homeTrax.projects.edit.ProjectEditor', [
    'ngMessages',
    'homeTrax.common.core.EditorMode',
    'homeTrax.common.core.Status',
    'homeTrax.common.resources.Project'
  ]).factory('ProjectEditor', projectEditorFactory);

  function projectEditorFactory($ionicModal, EditorMode, Status, Project) {
    return ProjectEditor;

    function ProjectEditor(parentScope) {
      var controller = this;

      controller.allProjects = [];
      controller.project = {};
      controller.editModel = new Project();
      controller.deferredModal = undefined;
      controller.title = '';

      controller.create = createProject;
      controller.edit = editProject;
      controller.save = saveProject;
      controller.cancel = hideEditor;

      activate();

      function createProject(projects){
        var p = new Project();
        p.status = Status.active;
        controller.title = 'New Project';
        controller.mode = EditorMode.create;
        showEditor(p, projects);
      }

      function editProject(project, projects){
        controller.title = 'Edit Project';
        controller.mode = EditorMode.edit;
        showEditor(project, projects);
      }

      function showEditor(project, projects) {
        initializeController();
        showModal();

        function initializeController() {
          controller.allProjects = projects;
          controller.project = project;

          angular.copy(project, controller.editModel);

          controller.isActive = (project.status === Status.active);
        }

        function showModal() {
          controller.deferredModal.then(function(dlg) {
            dlg.show();
          });
        }
      }

      function saveProject() {
        controller.editModel.$save(success, error);

        function success(prj) {
          hideEditor();
          angular.copy(prj, controller.project);
          if (controller.mode === EditorMode.create) {
            controller.allProjects.push(prj);
          }
        }

        function error(res) {
          controller.errorMessage = res.data.reason;
        }
      }

      function hideEditor() {
        controller.deferredModal.then(function(dlg) {
          dlg.hide();
        });
      }

      function activate() {
        var scope = parentScope.$new();
        scope.controller = controller;

        controller.deferredModal = $ionicModal.fromTemplateUrl('app/projects/edit/editor.html', {
          scope: scope,
          focusFirstInput: true,
          backdropClickToClose: false
        });

        controller.deferredModal.then(function(dlg) {
          scope.dialog = dlg;
          scope.$on('$destroy', function() {
            dlg.remove();
          });
        });
      }
    }
  }
}());
