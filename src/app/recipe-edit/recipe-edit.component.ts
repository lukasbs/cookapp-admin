import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  @ViewChild('message') messageRef: ElementRef;

  routerSub: Subscription;
  messageChanged: Subscription;

  public recipe: {name: string, description: string, image: string, ingredients: {name: string, amount: string}[]};
  public editMode;

  constructor(private appService: AppService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routerSub = this.route.queryParams.subscribe(
      params => {
        if (params.edit === 'true') {
          this.editMode = true;
          this.recipe = this.appService.currentlyEditedRecipe;
        } else {
          if (params.parse === 'true') {
            this.editMode = false;
            this.recipe = this.appService.currentlyEditedRecipe;
          } else {
            this.editMode = false;
            this.recipe = {name: '', description: '', image: '', ingredients: []};
          }
        }
      }
    );
    // put this in a method? it is used in few places
    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        } else if (message.type === 'SUCCESS') {
          this.appService.addSuccessMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );
  }

  validateForm(form: NgForm) {
    if (form.value.recipeName === null || form.value.recipeName === '' ||
      form.value.recipeDescription === null || form.value.recipeDescription === '' ||
      form.value.recipeImage === null || form.value.recipeImage === '') {
      return false;
    }

    for (const ingredient of this.recipe.ingredients) {
      if (ingredient.name === null || ingredient.name === '' || ingredient.amount === null || ingredient.amount === '') {
        return false;
      }
    }
    return true;
  }

  editHandler(form: NgForm) {
    if (this.validateForm(form)) {
      this.appService.updateRecipe(form.value.recipeName, form.value.recipeDescription, form.value.recipeImage,
        this.recipe.ingredients, this.recipe.name);
    } else {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę wypełnić wszystkie pola!');
    }
  }

  saveHandler(form: NgForm) {
    if (this.validateForm(form)) {
      this.appService.addRecipe(form.value.recipeName, form.value.recipeDescription, form.value.recipeImage, this.recipe.ingredients);
    } else {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę wypełnić wszystkie pola!');
    }
  }

  deleteIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }

  addIngredient() {
    this.recipe.ingredients.push({name: '', amount: ''});
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.messageChanged.unsubscribe();
  }
}
