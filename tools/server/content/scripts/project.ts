﻿/// <reference path="../../../lib/types.d.ts" />
/// <reference path="libs/angular.d.ts" />
/// <reference path="utils.ts" />

module lark {
    export interface LarkModule{
        checked?: boolean;
        readonly?: boolean;
    }
    export interface LarkPlatform {
        checked?: boolean;
    }
}

module lark.portal {

    export var project: lark.ILarkProject;

    export class Project {
        larkManifest = lark.manifest;
        scaleModes = lark.manifest.scaleModes;
        orientationModes = lark.manifest.orientationModes;
        modules: lark.LarkModule[] = [];
        platform: string = "web";
        scaleMode: string = 'noScale'; 
        orientationMode: string = 'auto'; 
        contentWidth: number = 480;
        contentHeight: number = 800;
        showPaintRects: boolean = false;
        template: string = "swan";
        port: number = 3000;
        isConfig = location.pathname.indexOf("/$/config") >= 0;
        isConfirmed = true;
        isLoadingShow = false;
        isCreated = false;
        background = "#888888";
        frameRate = 30;

        constructor() {
            this.larkManifest.modules.forEach(lm=> {
                if (lm.name == 'lark')
                    lm.checked = true;
                this.modules.forEach(m=> {
                    if (lm.name == m.name)
                        lm.checked = true;
                });
            });
            this.larkManifest.platforms.forEach(lm=> {
                if (lm.name == this.platform)
                    lm.checked = true;
            });
            this.selectTemplate(this.template);
            var port = parseInt(location.port || "80");
            this.port = port;
            var exist = location.search && location.search.indexOf("exist=true") >= 0;
            if (exist)
                this.isConfirmed = false;
        }

        finish() {
            var manifest = this.larkManifest;
            this.modules = manifest.modules.filter(m=> m.checked).map(m=> { return { name: m.name }; });
            //this.platform = manifest.platforms.filter(p=> p.checked)[0].name;
            this.larkManifest = undefined;
            var modes = this.scaleModes;
            this.scaleModes = undefined;
            var omodes = this.orientationModes;
            this.orientationModes = undefined;
            var json = JSON.stringify(this);
            console.log(json);

            $.get('', { proj: json },  ()=> {
                this.isCreated = true;
                this.isLoadingShow = false;
                $("#createdMask").show();
                $("#loadingMask").hide();
                $("#loading").remove();
            });
            this.scaleModes = modes;
            this.orientationModes = omodes;

            this.larkManifest = manifest;
            this.isLoadingShow = true;
            showLoading();
        }
        cancel() {
            $.get('', { cancel: true }, function () {});
            setTimeout(() => window.close(), 20);
        }

        close() {
            window.close();
        }

        switchSize() {
            var n = this.contentHeight;
            this.contentHeight = this.contentWidth;
            this.contentWidth = n;
        }
        selectTemplate(name: string) {
            this.template = name;
            var templates = this.larkManifest.templates;
            for (var i = 0; i < templates.length; i++) {
                if (templates[i].name == name) {
                    var modules = templates[i].modules;

                    this.larkManifest.modules.forEach(lm=> {

                        if (modules.indexOf(lm.name)>=0) {
                            lm.checked = true;
                            lm.readonly = true;
                        }
                        else
                            lm.readonly = false;
                    });
                    break;
                }
            }
        }
    }
}


lark.app.controller('ProjectController', lark.portal.Project);


function showLoading() {
    $("#loadingMask").show();
    var elem = $("#loading");
    elem.show();

    $({ deg: 0 }).animate({ deg: 360 }, {
        duration: 2000,
        step: function (now) {
            elem.css({
                'transform': 'rotate(' + now + 'deg)'
            });
        },
        easing:'linear',
        complete: showLoading
    });
}
