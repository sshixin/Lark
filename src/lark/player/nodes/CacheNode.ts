//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module lark.player {

    export var $cacheNodePool:ICacheNodePool;



    export class CacheNode extends BitmapNode {

        public needRedraw:boolean = false;

        public renderer:IScreenRenderer = null;
        /**
         * 显示对象的渲染节点发生改变时，把自身的RenderNode对象注册到此列表上。
         */
        private dirtyNodes:any = {};

        public dirtyList:Region[] = null;

        public dirtyRegion:DirtyRegion = new DirtyRegion();

        public markDirty(node:RenderNode):void {
            this.dirtyNodes[node.$hashCode] = node;
            if (!this.needRedraw) {
                this.needRedraw = true;
                var parentCache = this.target.$parentCacheNode;
                if (parentCache) {
                    parentCache.markDirty(this);
                }
            }
        }

        public updateDirtyNodes():Region[] {
            var nodeList = this.dirtyNodes;
            this.dirtyNodes = {};
            var dirtyRegion = this.dirtyRegion;
            for (var i in nodeList) {
                var node = nodeList[i];
                if (node.alpha !== 0) {
                    if(dirtyRegion.addRegion(node.minX, node.minY, node.maxX, node.maxY)){
                        node.isDirty = true;
                    }
                }
                node.update();
                if (node.moved && node.alpha !== 0) {
                    if(dirtyRegion.addRegion(node.minX, node.minY, node.maxX, node.maxY)){
                        node.isDirty = true;
                    }
                }
            }
            this.dirtyList = dirtyRegion.getDirtyRegions();
            return this.dirtyList;
        }

        /**
         * 结束重绘,清理缓存。
         */
        public cleanCache():void {
            this.dirtyRegion.clear();
            this.dirtyList = null;
            this.needRedraw = false;
        }

        public update():void {
            var target = this.target;
            target.$removeFlagsUp(DisplayObjectFlags.Dirty);
            this.matrix = target.$getConcatenatedMatrix();
            this.bounds = target.$getOriginalBounds();
            this.updateBounds();
            if (this.needRedraw) {
                this.updateDirtyNodes();
            }
        }
    }
}