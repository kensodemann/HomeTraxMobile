/* globals require */
(function() {
  'use strict';

  angular.module('homeTrax.common.services.systemMenu', [
    'ui.router'
  ]).factory('systemMenu', systemMenu);

  function systemMenu($rootScope, $state, $ionicHistory) {
    var service = {
      initialize: initialize,
      getNewItemMenuItem: getNewItemMenuItem
    };

    // @ifdef ELECTRON
    var remote = require('electron').remote;

    var editMenu = {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      }, {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      }, {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      }, {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      }, {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }]
    };

    var fileMenu = {
      label: 'File',
      submenu: [{
        label: 'New...',
        accelerator: 'CmdOrCtrl+N',
        enabled: false,
        click: function() {
          $rootScope.$broadcast('home-trax-new-item');
        }
      }, {
        label: 'Projects',
        accelerator: 'CmdOrCtrl+P',
        click: function() {
          goToState('app.projects.list');
        }
      }, {
        label: 'Current Timesheet',
        accelerator: 'CmdOrCtrl+T',
        click: function() {
          goToState('app.timesheets.viewCurrent');
        }
      }, {
        label: 'Time Report',
        accelerator: 'Shift+CmdOrCtrl+T',
        click: function() {
          goToState('app.reports.currentTimeReport');
        }
      }, {
        label: 'List Timesheets',
        accelerator: 'CmdOrCtrl+L',
        click: function() {
          goToState('app.timesheets.list');
        }
      }]
    };

    var viewMenu = {
      label: 'View',
      submenu: [{
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.reload();
          }
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (remote.process.platform == 'darwin') {
            return 'Ctrl+Command+F';
          }
          else {
            return 'F11';
          }
        })(),

        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: (function() {
          if (remote.process.platform == 'darwin') {
            return 'Alt+Command+I';
          }
          else {
            return 'Ctrl+Shift+I';
          }
        })(),

        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      }]
    };

    var windowMenu = {
      label: 'Window',
      role: 'window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      }, {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }]
    };

    var helpMenu = {
      label: 'Help',
      role: 'help',
      submenu: [{
        label: 'Learn More',
        click: function() {
          require('electron').shell.openExternal('http://electron.atom.io');
        }
      }]
    };

    function prependMainMenu(template) {
      var name = remote.app.getName();
      template.unshift({
        label: name,
        submenu: [{
          label: 'About ' + name,
          click: function() {
            goToState('app.about');
          }
        }, {
          type: 'separator'
        }, {
          label: 'Services',
          role: 'services',
          submenu: []
        }, {
          type: 'separator'
        }, {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        }, {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        }, {
          label: 'Show All',
          role: 'unhide'
        }, {
          type: 'separator'
        }, {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            remote.app.quit();
          }
        }]
      });
    }

    function appendToWindowMenu(menu) {
      menu.submenu.push({
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        role: 'front'
      });
    }

    function goToState(s) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go(s);
    }

    // @endif

    var menu = {};

    function initialize() {
      // @ifdef ELECTRON
      var template = [fileMenu, editMenu, viewMenu, windowMenu, helpMenu];

      if (remote.process.platform == 'darwin') {
        prependMainMenu(template);
        appendToWindowMenu(windowMenu);
      }

      var Menu = remote.Menu;
      menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
      // @endif
    }

    function getNewItemMenuItem() {
      var newItemMenuItem;

      // @ifdef ELECTRON
      var fileMenu = _.find(menu.items, function(m) {
        return m.label === 'File';
      });

      if (fileMenu) {
        newItemMenuItem = _.find(fileMenu.submenu.items, function(m) {
          return m.label === 'New...';
        });
      }
      // @endif

      return newItemMenuItem;
    }

    return service;
  }
}());
