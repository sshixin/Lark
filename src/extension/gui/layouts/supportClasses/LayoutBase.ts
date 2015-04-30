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

module lark.gui {

    /**
     * 容器布局基类
     */
    export class LayoutBase extends EventEmitter{

        public constructor(){
            super();
        }

        $target: GroupBase = null;
        /**
         * 目标容器
         */
        public get target():GroupBase{
            return this.$target;
        }

        public set target(value:GroupBase){
            if (this.$target === value)
                return;
            this.$target = value;
            this.clearVirtualLayoutCache();
        }


        $useVirtualLayout:boolean = false;
        /**
         * 若要配置容器使用虚拟布局，请为与容器关联的布局的 useVirtualLayout 属性设置为 true。
         * 只有布局设置为 VerticalLayout、HorizontalLayout
         * 或 TileLayout 的 DataGroup 或 SkinnableDataContainer
         * 才支持虚拟布局。不支持虚拟化的布局子类必须禁止更改此属性。
         */
        public get useVirtualLayout():boolean{
            return this.$useVirtualLayout;
        }

        public set useVirtualLayout(value:boolean){
            if (this.$useVirtualLayout == value)
                return;

            this.$useVirtualLayout = value;
            this.emitWith("useVirtualLayoutChanged");

            if (this.$useVirtualLayout && !value)
                this.clearVirtualLayoutCache();
            if (this.target)
                this.target.invalidateDisplayList();
        }

        private _typicalLayoutRect: Rectangle = null;

        /**
         * 由虚拟布局所使用，以估计尚未滚动到视图中的布局元素的大小。
         */
        public get typicalLayoutRect():Rectangle{
            return this._typicalLayoutRect;
        }

        public set typicalLayoutRect(value:Rectangle){
            if(this._typicalLayoutRect==value)
                return;
            this._typicalLayoutRect = value;
            if (this.target)
                this.target.invalidateSize();
        }
        /**
         * 滚动条位置改变
         */
        protected scrollPositionChanged():void{
        }

        /**
         * 清理虚拟布局缓存的数据
         */
        public clearVirtualLayoutCache():void{
        }
        /**
         * 在已添加布局元素之后且在验证目标的大小和显示列表之前，由目标调用。
         * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。
         * @param index 发生改变的子项索引
         */
        public elementAdded(index:number):void{
        }
        /**
         * 必须在已删除布局元素之后且在验证目标的大小和显示列表之前，由目标调用此方法。
         * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。
         * @param index 发生改变的子项索引
         */
        public elementRemoved(index:number):void{
        }

        /**
         * 测量组件尺寸大小
         */
        public measure():void{
        }
        /**
         * 更新显示列表
         */
        public updateDisplayList(width:number, height:number):void{
        }
    }
}