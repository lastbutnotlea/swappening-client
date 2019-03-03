import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {Observable} from "rxjs";
import {Event} from "../../shared/event-model";
import {DataService} from "../../services/data.service";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {DateDisplayService} from "../../services/date-display.service";
import {FormControl} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent} from "@angular/material";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: "app-swipe-events",
  templateUrl: "./swipe-events.component.html",
  styleUrls: ["./swipe-events.component.scss"],
})
export class SwipeEventsComponent implements OnInit {

  private swipeEvents$: Observable<Event[]>;
  private swipeEvents: Event[];
  private apiUrl: string;

  private filterExpanded = false;
  private tags: string[] = [];
  private tagCtrl = new FormControl();
  private filteredTags: Observable<string[]>;
  private allTags: string[] = ["Pool", "Shit"];
  private initialSetup = true;

  @ViewChild("tagInput") tagInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  constructor(public dataService: DataService,
              private dateDisplayService: DateDisplayService,
              private router: Router) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filterTags(tag) : this.allTags.slice()));
    dataService.allTags.subscribe(allTags => {
      this.allTags = allTags;
    });
    dataService.currentlySelectedTags.subscribe(currTags => this.tags = currTags);
  }

  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.swipeEvents$ = this.dataService.swipeEvents;
    this.swipeEvents$.subscribe(newEvents => {
      this.swipeEvents = newEvents;
    });
    this.dataService.swipeEventsLoaded.subscribe(ready => {
      if (!ready) {
        return;
      } else {
        this.setUpCards();
        this.stackedCards();
      }
    });
  }

  filter() {
    if (this.filterExpanded) {
      this.initialSetup = true;
      this.dataService.resetEventCounter();
      this.dataService.fetchInitialSwipeEvents(this.tags);
      this.filterExpanded = false;
    } else {
      this.filterExpanded = true;
    }
  }

  hideFilter() {
    this.filterExpanded = false;
  }

  private _filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || "").trim()) {
        this.tags.push(value.trim());
      }

      if (input) {
        input.value = "";
      }

      this.tagCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = "";
    this.tagCtrl.setValue(null);
  }

  setUpCards() {
    let numberOfCards;
    const container = document.getElementById("stackedcards-container");
    let startIndex = 0;
    if (this.initialSetup) {
      numberOfCards = environment.reloadEvery * 1.5 - this.dataService.eventCounter;
      container.innerHTML = '';
      this.initialSetup = false;
    }
    else {
      numberOfCards = environment.reloadEvery;
      startIndex = environment.reloadEvery / 2;
    }
    for (let i = startIndex; i < startIndex + numberOfCards; i++) {
      if (i >= this.swipeEvents.length) {
        this.dataService.increaseEventCounter();
        continue;
      }
      if (this.swipeEvents[i].pictures_events.length === 0) {
        this.dataService.increaseEventCounter();
        continue;
      }
      container.innerHTML = container.innerHTML.concat(
        `<div _ngcontent-c1="" class="card-item stackedcards-top stackedcards--animatable
            stackedcards-origin-top stackedcards-active">
            <h1 class="event-card-headline">
             ${this.swipeEvents[i].headline}
            </h1>
            <div class="swipe-image-container">
            <img alt="image" src="${this.apiUrl}/files/${this.swipeEvents[i].pictures_events[0].pictureStorageName}">
            </div>
            <mat-chip-list _ngcontent-c7="" class="mat-chip-list" tabindex="0" aria-required="false" aria-disabled="false" aria-invalid="false" aria-multiselectable="false" role="listbox" aria-orientation="horizontal" id="mat-chip-list-0">
            <div class="mat-chip-list-wrapper">
            ${this.swipeEvents[i].taggedEvents.map(
          tag => `<mat-chip _ngcontent-c7="" class="mat-chip mat-primary mat-standard-chip" role="option" tabindex="-1" aria-disabled="false" aria-selected="false">
              ${tag.tag.tagName}</mat-chip>`).join('')}
            </div>
            </mat-chip-list>
            <div class="info">
              <div>
                <img class="icon" src="./assets/icons-black/time.png">
                ${this.dateDisplayService.parseDate(this.swipeEvents[i].startTime)}
              </div>
              <div>
                <img class="icon" src="./assets/icons-black/pin.png">
                ${this.swipeEvents[i].place}
              </div>
            </div>
         </div>`
      );
    }

    //this.dataService.resetEventCounter();
  }

  stackedCards(): void {
    const stackedOptions = "Top";
    /*Change stacked cards view from 'Bottom', 'Top' or 'None'.*/
    const rotate = true;
    /*Activate the elements' rotation for each move on stacked cards.*/
    let items = 3;
    /* Number of visible elements when the stacked options are bottom or top.*/
    const elementsMargin = 10;
    /*Define the distance of each element when the stacked options are bottom or top.*/
    const useOverlays = true;
    /*Enable or disable the overlays for swipe elements.*/
    let maxElements;
    /*Total of stacked cards on DOM.*/
    const currentPosition = 0;
    /*Keep the position of active stacked card.*/
    const velocity = 0.3;
    /*Minimum velocity allowed to trigger a swipe.*/
    let topObj;
    /*Keep the swipe top properties.*/
    let rightObj;
    /*Keep the swipe right properties.*/
    let leftObj;
    /*Keep the swipe left properties.*/
    let listElNodesObj;
    /*Keep the list of nodes from stacked cards.*/
    let listElNodesWidth;
    /*Keep the stacked cards width.*/
    let currentElementObj;
    /*Keep the stacked card element to swipe.*/
    let stackedCardsObj;
    let isFirstTime = true;
    let elementHeight;
    let obj;
    let elTrans;
    const that = this;

    function init() {
      obj = document.getElementById("stacked-cards-block");
      stackedCardsObj = document.getElementById("stackedcards-container");
      listElNodesObj = stackedCardsObj.children;

      topObj = obj.querySelector(".stackedcards-overlay.top");
      rightObj = obj.querySelector(".stackedcards-overlay.right");
      leftObj = obj.querySelector(".stackedcards-overlay.left");

      countElements();
      currentElement();
      changeBackground();
      listElNodesWidth = stackedCardsObj.offsetWidth;
      currentElementObj = listElNodesObj[0];
      updateUi();

      //  Prepare elements on DOM
      const addMargin = elementsMargin * (items - 1) + "px";

      if (stackedOptions === "Top") {

        for (let i = items; i < maxElements; i++) {
          listElNodesObj[i].classList.add("stackedcards-top", "stackedcards--animatable", "stackedcards-origin-top");
        }

        elTrans = elementsMargin * (items - 1);

        stackedCardsObj.style.marginBottom = addMargin;

      } else if (stackedOptions === "Bottom") {


        for (let i = items; i < maxElements; i++) {
          listElNodesObj[i].classList.add("stackedcards-bottom", "stackedcards--animatable", "stackedcards-origin-bottom");
        }

        elTrans = 0;

        stackedCardsObj.style.marginBottom = addMargin;

      } else if (stackedOptions === "None") {

        for (let i = items; i < maxElements; i++) {
          listElNodesObj[i].classList.add("stackedcards-none", "stackedcards--animatable");
        }

        elTrans = 0;

      }

      for (let i = items; i < maxElements; i++) {
        listElNodesObj[i].style.zIndex = 0;
        listElNodesObj[i].style.opacity = 0;
        listElNodesObj[i].style.webkitTransform = "scale(" + (1 - (items * 0.04))
          + ") translateX(0) translateY(" + elTrans + "px) translateZ(0)";
        listElNodesObj[i].style.transform = "scale(" + (1 - (items * 0.04)) + ") translateX(0) translateY(" + elTrans + "px) translateZ(0)";
      }

      if (listElNodesObj[currentPosition]) {
        listElNodesObj[currentPosition].classList.add("stackedcards-active");
      }
    }

    init();

    if (useOverlays) {
      leftObj.style.transform = "translateX(0px) translateY(" + elTrans + "px) translateZ(0px) rotate(0deg)";
      leftObj.style.webkitTransform = "translateX(0px) translateY(" + elTrans + "px) translateZ(0px) rotate(0deg)";

      rightObj.style.transform = "translateX(0px) translateY(" + elTrans + "px) translateZ(0px) rotate(0deg)";
      rightObj.style.webkitTransform = "translateX(0px) translateY(" + elTrans + "px) translateZ(0px) rotate(0deg)";

      topObj.style.transform = "translateX(0px) translateY(" + elTrans + "px) translateZ(0px) rotate(0deg)";
      topObj.style.webkitTransform = "translateX(0px) translateY(" + elTrans + "px) translateZ(0px) rotate(0deg)";

    } else {
      leftObj.className = "";
      rightObj.className = "";
      topObj.className = "";

      leftObj.classList.add("stackedcards-overlay-hidden");
      rightObj.classList.add("stackedcards-overlay-hidden");
      topObj.classList.add("stackedcards-overlay-hidden");
    }

    //  Remove class init
    setTimeout(function () {
      obj.classList.remove("init");
    }, 150);


    function backToMiddle() {

      removeNoTransition();
      transformUi(0, 0, 1, currentElementObj);

      if (useOverlays) {
        transformUi(0, 0, 0, leftObj);
        transformUi(0, 0, 0, rightObj);
        transformUi(0, 0, 0, topObj);
      }

      setZindex(5);

      if (!(currentPosition >= maxElements)) {
        //  roll back the opacity of second element
        if ((currentPosition + 1) < maxElements) {
          listElNodesObj[currentPosition + 1].style.opacity = ".8";
        }
      }
    }

    //  Usable functions
    function countElements() {
      maxElements = listElNodesObj.length;
      if (items > maxElements) {
        items = maxElements;
      }
    }

    //  Keep the active card.
    function currentElement() {
      currentElementObj = listElNodesObj[currentPosition];
    }

    // Change background for each swipe.
    function changeBackground() {
      document.body.classList.add("background-" + currentPosition + "");
    }

    // Change states
    function changeStages() {
      if (currentPosition === maxElements) {
        // Event listener created to know when transition ends and changes states
        listElNodesObj[maxElements - 1].addEventListener("transitionend", function () {
          document.body.classList.add("background-7");
          document.querySelector(".stage").classList.add("hidden");
          document.querySelector(".final-state").classList.remove("hidden");
          document.querySelector(".final-state").classList.add("active");
          listElNodesObj[maxElements - 1].removeEventListener("transitionend", null, false);
        });
      }
    }

    // Functions to swipe left elements on logic external action.
    function onActionLeft() {
      if (!(currentPosition >= maxElements)) {
        if (useOverlays) {
          leftObj.classList.remove("no-transition");
          topObj.classList.remove("no-transition");
          leftObj.style.zIndex = "8";
          transformUi(0, 0, 1, leftObj);

        }

        setTimeout(function () {
          onSwipeLeft();
          resetOverlayLeft();
        }, 300);
      }
    }

    // Functions to swipe right elements on logic external action.
    function onActionRight() {
      if (!(currentPosition >= maxElements)) {
        if (useOverlays) {
          rightObj.classList.remove("no-transition");
          topObj.classList.remove("no-transition");
          rightObj.style.zIndex = "8";
          transformUi(0, 0, 1, rightObj);
        }

        setTimeout(function () {
          onSwipeRight();
          resetOverlayRight();
        }, 300);
      }
    }

    // Functions to swipe top elements on logic external action.
    function onActionTop() {
      if (!(currentPosition >= maxElements)) {
        if (useOverlays) {
          leftObj.classList.remove("no-transition");
          rightObj.classList.remove("no-transition");
          topObj.classList.remove("no-transition");
          topObj.style.zIndex = "8";
          transformUi(0, 0, 1, topObj);
        }

        setTimeout(function () {
          onSwipeTop();
          resetOverlays();
        }, 300); // wait animations end
      }
    }

    // Swipe active card to left.
    function onSwipeLeft() {
      removeNoTransition();
      transformUi(-1000, 0, 0, currentElementObj);
      if (useOverlays) {
        transformUi(-1000, 0, 0, leftObj); // Move leftOverlay
        transformUi(-1000, 0, 0, topObj); // Move topOverlay
        resetOverlayLeft();
      }

      afterSwipe('left');

      // currentPosition = currentPosition + 1;
      updateUi();
      currentElement();
      changeBackground();
      changeStages();
      setActiveHidden();
    }

    // Swipe active card to right.
    function onSwipeRight() {
      removeNoTransition();
      transformUi(1000, 0, 0, currentElementObj);
      if (useOverlays) {
        transformUi(1000, 0, 0, rightObj); // Move rightOverlay
        transformUi(1000, 0, 0, topObj); // Move topOverlay
        resetOverlayRight();
      }

      afterSwipe('right');

      // currentPosition = currentPosition + 1;
      updateUi();
      currentElement();
      changeBackground();
      changeStages();
      setActiveHidden();
    }

    // Swipe active card to top.
    function onSwipeTop() {
      removeNoTransition();
      transformUi(0, -1000, 0, currentElementObj);
      if (useOverlays) {
        transformUi(0, -1000, 0, leftObj); // Move leftOverlay
        transformUi(0, -1000, 0, rightObj); // Move rightOverlay
        transformUi(0, -1000, 0, topObj); // Move topOverlay
        resetOverlays();
      }

      afterSwipe('top');

      // currentPosition = currentPosition + 1;
      updateUi();
      currentElement();
      changeBackground();
      changeStages();
      setActiveHidden();
    }

    function afterSwipe(swipeDirection: string) {
      stackedCardsObj.removeChild(currentElementObj);
      that.dataService.swipeAnEvent(swipeDirection);
      that.dataService.increaseEventCounter();
      if (that.dataService.eventCounter === environment.reloadEvery) {
        that.dataService.fetchNewSwipeEvents(that.tags);
        that.dataService.resetEventCounter();
      }
        /*const container = document.getElementById("stackedcards-container");
        for (let i = 0; i < environment.reloadEvery; i++) {
          if (that.swipeEvents[i].pictures_events.length === 0) {
            that.dataService.increaseEventCounter();
            continue;
          }
          container.innerHTML = container.innerHTML.concat(
            `<div _ngcontent-c1="" class="card-item stackedcards-top stackedcards--animatable
    stackedcards-origin-top stackedcards-active">
    <h1 class="event-card-headline">
    ${that.swipeEvents[i + environment.reloadEvery / 2].headline}
    </h1>
    <div class="swipe-image-container">
    <img style="width: 100%" alt="image" src="${that.apiUrl}/files/${that.swipeEvents[i + environment.reloadEvery / 2].pictures_events[0].pictureStorageName}">
    </div>  
    <mat-chip-list _ngcontent-c7="" class="mat-chip-list" tabindex="0" aria-required="false" aria-disabled="false" aria-invalid="false" aria-multiselectable="false" role="listbox" aria-orientation="horizontal" id="mat-chip-list-0">
    <div class="mat-chip-list-wrapper">
      ${that.swipeEvents[i + environment.reloadEvery / 2].taggedEvents.map(
              tag => `<mat-chip _ngcontent-c7="" class="mat-chip mat-primary mat-standard-chip" role="option" tabindex="-1" aria-disabled="false" aria-selected="false">
        ${tag.tag.tagName}</mat-chip>`).join('')}
    </div>
    </mat-chip-list>
    <div class="info">
    <div>
    <img class="icon" src="./assets/icons-black/time.png">
    ${that.dateDisplayService.parseDate(that.swipeEvents[i + environment.reloadEvery / 2].startTime)}
    </div>
    <div>
    <img class="icon" src="./assets/icons-black/pin.png">
    ${that.swipeEvents[i + environment.reloadEvery / 2].place}
    </div>
    </div>
    </div>`
          );
        }
        that.dataService.resetEventCounter();
      }*/

      init();
    }

// Remove transitions from all elements to be moved in each swipe movement to improve perfomance of stacked cards.
    function removeNoTransition() {
      if (listElNodesObj[currentPosition]) {

        if (useOverlays) {
          leftObj.classList.remove("no-transition");
          rightObj.classList.remove("no-transition");
          topObj.classList.remove("no-transition");
        }

        listElNodesObj[currentPosition].classList.remove("no-transition");
        listElNodesObj[currentPosition].style.zIndex = 6;
      }

    }

// Move the overlay left to initial position.
    function resetOverlayLeft() {

      if (!(currentPosition >= maxElements)) {
        if (useOverlays) {
          setTimeout(function () {

            if (stackedOptions === "Top") {

              elTrans = elementsMargin * (items - 1);

            } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

              elTrans = 0;

            }

            if (!isFirstTime) {

              leftObj.classList.add("no-transition");
              topObj.classList.add("no-transition");

            }

            requestAnimationFrame(function () {

              leftObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              leftObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              leftObj.style.opacity = "0";

              topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              topObj.style.opacity = "0";

            });

          }, 300);

          isFirstTime = false;
        }
      }
    }

// Move the overlay right to initial position.
    function resetOverlayRight() {

      if (!(currentPosition >= maxElements)) {
        if (useOverlays) {
          setTimeout(function () {

            if (stackedOptions === "Top") {

              elTrans = elementsMargin * (items - 1);

            } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

              elTrans = 0;

            }

            if (!isFirstTime) {

              rightObj.classList.add("no-transition");
              topObj.classList.add("no-transition");

            }

            requestAnimationFrame(function () {

              rightObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              rightObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              rightObj.style.opacity = "0";

              topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              topObj.style.opacity = "0";

            });

          }, 300);

          isFirstTime = false;
        }
      }
    }

// Move the overlays to initial position.
    function resetOverlays() {

      if (!(currentPosition >= maxElements)) {
        if (useOverlays) {

          setTimeout(function () {
            if (stackedOptions === "Top") {

              elTrans = elementsMargin * (items - 1);

            } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

              elTrans = 0;

            }

            if (!isFirstTime) {

              leftObj.classList.add("no-transition");
              rightObj.classList.add("no-transition");
              topObj.classList.add("no-transition");

            }

            requestAnimationFrame(function () {

              leftObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              leftObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              leftObj.style.opacity = "0";

              rightObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              rightObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              rightObj.style.opacity = "0";

              topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
              topObj.style.opacity = "0";

            });

          }, 300);	//  wait for animations time

          isFirstTime = false;
        }
      }
    }

    function setActiveHidden() {
      /*      if (!(currentPosition >= maxElements)) {
              listElNodesObj[currentPosition - 1].classList.remove('stackedcards-active');
              listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden');
              listElNodesObj[currentPosition].classList.add('stackedcards-active');
            }*/
    }

// Set the new z-index for specific card.
    function setZindex(zIndex) {
      if (listElNodesObj[currentPosition]) {
        listElNodesObj[currentPosition].style.zIndex = zIndex;
      }
    }

    /*
    Remove element from the DOM after swipe.
    To use this method you need to call this function in onSwipeLeft, onSwipeRight and onSwipeTop
    and put the method just above the variable 'currentPosition = currentPosition + 1'.
    On the actions onSwipeLeft, onSwipeRight and onSwipeTop you need to remove the currentPosition
    variable (currentPosition = currentPosition + 1) and the function setActiveHidden
    */

    function removeElement() {
      currentElementObj.remove();
      if (!(currentPosition >= maxElements)) {
        listElNodesObj[currentPosition].classList.add("stackedcards-active");
      }
    }

// Add translate X and Y to active card for each frame.
    function transformUi(moveX, moveY, opacity, elementObj) {
      requestAnimationFrame(function () {
        const element = elementObj;

        //  Function to generate rotate value
        function RotateRegulator(value) {
          // TODO 15 entspricht rotation nach rechts; -15 entspricht rotation nach links; wenn man immer -15 zurückgibt hat man keine probleme mehr
          if (value > 150) {
            return 15;
          } else if (value < -150) {
            return -15;
          }
          return value / 10;
        }

        // TODO: es liegt an der rotation; wenn man rotateElement auf 0 lässt, keine Probleme mehr
        let rotateElement = 0;
        if (rotate) {
          rotateElement = RotateRegulator(moveX);
        }

        if (stackedOptions === "Top") {
          elTrans = elementsMargin * (items - 1);
          if (element) {
            // TODO jan meint das hier ist besonders teuer; vielleicht kommt man irgendwie drum herum die styles so
            // zu setzen? oder man setzt die rotation nur wenn man wirklich rotieren muss? geht das getrennt vom rest?
            element.style.webkitTransform = "translateX(" + moveX + "px) translateY("
              + (moveY + elTrans) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
            element.style.transform = "translateX(" + moveX + "px) translateY("
              + (moveY + elTrans) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
            element.style.opacity = opacity;
          }
        } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

          if (element) {
            element.style.webkitTransform = "translateX(" + moveX + "px) translateY(" + (moveY)
              + "px) translateZ(0) rotate(" + rotateElement + "deg)";
            element.style.transform = "translateX(" + moveX + "px) translateY("
              + (moveY) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
            element.style.opacity = opacity;
          }

        }
      });
    }

//  Action to update all elements on the DOM for each stacked card.
    function updateUi() {
      requestAnimationFrame(function () {
        elTrans = 0;
        let elZindex = 5;
        let elScale = 1;
        let elOpac = 1;
        let elTransTop = items;
        const elTransInc = elementsMargin;

        for (let i = currentPosition; i < (currentPosition + items); i++) {
          if (listElNodesObj[i]) {
            if (stackedOptions === "Top") {

              listElNodesObj[i].classList.add("stackedcards-top", "stackedcards--animatable", "stackedcards-origin-top");

              if (useOverlays) {
                leftObj.classList.add("stackedcards-origin-top");
                rightObj.classList.add("stackedcards-origin-top");
                topObj.classList.add("stackedcards-origin-top");
              }

              elTrans = elTransInc * elTransTop;
              elTransTop--;

            } else if (stackedOptions === "Bottom") {
              listElNodesObj[i].classList.add("stackedcards-bottom", "stackedcards--animatable", "stackedcards-origin-bottom");

              if (useOverlays) {
                leftObj.classList.add("stackedcards-origin-bottom");
                rightObj.classList.add("stackedcards-origin-bottom");
                topObj.classList.add("stackedcards-origin-bottom");
              }

              elTrans = elTrans + elTransInc;

            } else if (stackedOptions === "None") {

              listElNodesObj[i].classList.add("stackedcards-none", "stackedcards--animatable");
              elTrans = elTrans + elTransInc;

            }

            listElNodesObj[i].style.transform = "scale(" + elScale + ") translateX(0) translateY("
              + (elTrans - elTransInc) + "px) translateZ(0)";
            listElNodesObj[i].style.webkitTransform = "scale(" + elScale + ") translateX(0) translateY("
              + (elTrans - elTransInc) + "px) translateZ(0)";
            listElNodesObj[i].style.opacity = elOpac;
            listElNodesObj[i].style.zIndex = elZindex;

            elScale = elScale - 0.04;
            elOpac = elOpac - (1 / items);
            elZindex--;
          }
        }

      });

    }

// Touch events block
    const element = obj;
    let startTime;
    let startX;
    let startY;
    let translateX;
    let translateY;
    let currentX;
    let currentY;
    let touchingElement = false;
    let timeTaken;
    let topOpacity;
    let rightOpacity;
    let leftOpacity;

    function setOverlayOpacity() {

      topOpacity = (((translateY + (elementHeight) / 2) / 100) * -1);
      rightOpacity = translateX / 100;
      leftOpacity = ((translateX / 100) * -1);


      if (topOpacity > 1) {
        topOpacity = 1;
      }

      if (rightOpacity > 1) {
        rightOpacity = 1;
      }

      if (leftOpacity > 1) {
        leftOpacity = 1;
      }
    }

    function gestureStart(evt) {
      startTime = new Date().getTime();

      startX = evt.changedTouches[0].clientX;
      startY = evt.changedTouches[0].clientY;

      currentX = startX;
      currentY = startY;

      setOverlayOpacity();

      touchingElement = true;
      if (!(currentPosition >= maxElements)) {
        if (listElNodesObj[currentPosition]) {
          listElNodesObj[currentPosition].classList.add("no-transition");
          setZindex(6);

          if (useOverlays) {
            leftObj.classList.add("no-transition");
            rightObj.classList.add("no-transition");
            topObj.classList.add("no-transition");
          }

          if ((currentPosition + 1) < maxElements) {
            listElNodesObj[currentPosition + 1].style.opacity = "1";
          }

          elementHeight = listElNodesObj[currentPosition].offsetHeight / 3;
        }

      }

    }

    function gestureMove(evt) {
      currentX = evt.changedTouches[0].pageX;
      currentY = evt.changedTouches[0].pageY;

      translateX = currentX - startX;
      translateY = currentY - startY;

      setOverlayOpacity();

      if (!(currentPosition >= maxElements)) {
        evt.preventDefault();
        transformUi(translateX, translateY, 1, currentElementObj);

        if (useOverlays) {
          transformUi(translateX, translateY, topOpacity, topObj);

          if (translateX < 0) {
            transformUi(translateX, translateY, leftOpacity, leftObj);
            transformUi(0, 0, 0, rightObj);

          } else if (translateX > 0) {
            transformUi(translateX, translateY, rightOpacity, rightObj);
            transformUi(0, 0, 0, leftObj);
          }

          if (useOverlays) {
            leftObj.style.zIndex = 8;
            rightObj.style.zIndex = 8;
            topObj.style.zIndex = 7;
          }

        }

      }

    }

    function gestureEnd(evt) {

      if (!touchingElement) {
        return;
      }

      translateX = currentX - startX;
      translateY = currentY - startY;

      timeTaken = new Date().getTime() - startTime;

      touchingElement = false;

      if (!(currentPosition >= maxElements)) {
        if (translateY < (elementHeight * -1) &&
          translateX > ((listElNodesWidth / 2) * -1) &&
          translateX < (listElNodesWidth / 2)) {  // is Top?

          if (translateY < (elementHeight * -1) || (Math.abs(translateY) / timeTaken > velocity)) { //  Did It Move To Top?
            onSwipeTop();
          } else {
            backToMiddle();
          }

        } else {

          if (translateX < 0) {
            if (translateX < ((listElNodesWidth / 2) * -1) || (Math.abs(translateX) / timeTaken > velocity)) { // Did It Move To Left?
              onSwipeLeft();
            } else {
              backToMiddle();
            }
          } else if (translateX > 0) {

            if (translateX > (listElNodesWidth / 2) && (Math.abs(translateX) / timeTaken > velocity)) { // Did It Move To Right?
              onSwipeRight();
            } else {
              backToMiddle();
            }

          }
        }
      }
    }

    element.addEventListener("touchstart", gestureStart, false);
    element.addEventListener("touchmove", gestureMove, false);
    element.addEventListener("touchend", gestureEnd, false);
    element.addEventListener("click", route, false);

// Add listeners to call global action for swipe cards
    const buttonLeft = document.querySelector(".left-action");
    const buttonTop = document.querySelector(".top-action");
    const buttonRight = document.querySelector(".right-action");

    buttonLeft.addEventListener("click", onActionLeft, false);
    buttonTop.addEventListener("click", onActionTop, false);
    buttonRight.addEventListener("click", onActionRight, false);

    function route() {
      const currentId = that.swipeEvents[0].id;
      that.router.navigate(["/swipeevents/" + currentId]);
    }
  }
}
