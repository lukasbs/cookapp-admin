import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import {RecipeModel} from '../model/RecipeModel';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit {

  public recipe: RecipeModel;


  constructor(private appService: AppService) { }

  ngOnInit() {
    this.recipe = this.appService.currentlyEditedRecipe;
  }

}
