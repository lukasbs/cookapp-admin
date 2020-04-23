import {Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  @ViewChild('message') messageRef: ElementRef;
  public currentPageRecipes = null;

  recipeListChanged: Subscription;
  currentRecipesPageChanged: Subscription;
  messageChanged: Subscription;

  constructor(private appService: AppService, private modalService: NgbModal, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.recipeListChanged = this.appService.recipeListChanged.subscribe(
      (recipeList) => {
        recipeList.sort((a, b) => a.name.localeCompare(b.name));
        this.appService.recipeListChunked = this.appService.cutIntoChunks(recipeList);

        if (this.appService.currentRecipesPage > this.appService.recipeListChunked.length - 1) {
          this.appService.currentRecipesPage = this.appService.recipeListChunked.length - 1;
        }

        this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
      }
    );

    this.currentRecipesPageChanged = this.appService.currentRecipesPageChanged.subscribe(
      (page) => {
        this.currentPageRecipes = this.appService.recipeListChunked[page];
      }
    );

    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );

    this.appService.getAllRecipes();
  }

  nextPage() {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.currentRecipesPage++;
    this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
  }

  previousPage() {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.currentRecipesPage--;
    this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
  }

  addHandler(recipeCreateEdit) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { edit: 'false' },
        queryParamsHandling: 'merge'
      });
    this.modalService.open(recipeCreateEdit, { size: 'lg', centered: true, backdropClass: 'modal-dark-backdrop'})
      .result.then(() => {}, () => {
          this.router.navigate(['/recipe-list']);
        });
  }

  editHandler(i: number, recipeCreateEdit) {
    this.appService.currentlyEditedRecipe = this.currentPageRecipes[i];
    this.appService.currentlyEditedRecipeChanged.next(this.appService.currentlyEditedRecipe);
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { edit: 'true' },
        queryParamsHandling: 'merge'
      });
    this.modalService.open(recipeCreateEdit, { windowClass: 'xl-modal', centered: true, backdropClass: 'modal-dark-backdrop'})
      .result.then(() => {}, () => {
          this.router.navigate(['/recipe-list']);
        });
  }

  previewHandler(i: number) {
    this.appService.currentlyEditedRecipe = this.currentPageRecipes[i];
    this.appService.currentlyEditedRecipeChanged.next(this.appService.currentlyEditedRecipe);
    this.router.navigate(['/recipe-view']);
  }

  deleteHandler(i: number) {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.deleteRecipe(this.appService.recipeListChunked[this.appService.currentRecipesPage][i].name);
  }

  searchHandler(form: NgForm) {
    this.appService.clearClass(this.messageRef.nativeElement);
    if (form.value.searchRecipe !== null && form.value.searchRecipe !== '') {
      this.appService.currentRecipesPage = 0;
      this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
      this.appService.getRecipeByName(form.value.searchRecipe);
    } else {
      this.appService.currentRecipesPage = 0;
      this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
      this.appService.getAllRecipes();
    }
  }

  ngOnDestroy(): void {
    this.recipeListChanged.unsubscribe();
    this.currentRecipesPageChanged.unsubscribe();
    this.messageChanged.unsubscribe();
  }
}
