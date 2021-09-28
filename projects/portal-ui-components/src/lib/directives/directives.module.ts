import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrimDirective } from './trim.directive';
import { DroppableDirective } from './droppable.directive';
import { DraggableDirective } from './draggable.directive';
import { MovableDirective } from './movable.directive';
import { AsyncLoaderDirective } from './async-loader.directive';
import { ResizableDirective } from './resizable.directive';
import { DropzoneDirective } from './dropzone.directive';
import { MovableAreaDirective } from './movable-area.directive';
import { DraggableHelperDirective } from './draggable-helper.directive';
import { OAOArcDirective } from './oao-arc.directive';
import { ToolTipRendererDirective } from './tool-tip-renderer.directive';

@NgModule({
  declarations: [
    TrimDirective,
    DroppableDirective,
    DraggableDirective,
    MovableDirective,
    AsyncLoaderDirective,
    ResizableDirective,
    DropzoneDirective,
    MovableAreaDirective,
    DraggableHelperDirective,
    OAOArcDirective,
    ToolTipRendererDirective
  ],
  imports: [
    CommonModule
  ],

  exports: [
    TrimDirective,
    DroppableDirective,
    DraggableDirective,
    MovableDirective,
    AsyncLoaderDirective,
    ResizableDirective,
    DropzoneDirective,
    MovableAreaDirective,
    DraggableHelperDirective,
    OAOArcDirective,
    ToolTipRendererDirective
  ]
})
export class PucDirectivesModule { }
