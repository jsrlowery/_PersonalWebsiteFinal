
// Manage the wave of fade in and fade out of the icons and their languages.

const interval = 2500; // In miliseconds
const delta = 150; // In miliseconds
const cButtons = ".carousel-control-prev, .carousel-control-next";
const cascadeEvent = "click.cascade";
const logo = ".skill-logo"
const text = ".skill-text-container"
const hover = ":hover";
const container = ".active .skill-container";
const carousel = "#skillCarousel"
const skillQueries = {
  container: null,
  logo: null,
  text: null
}
const opacities = {
  logo: 1,
  text: 0
};

let locked = [];
let hasQuery = function(v) { return $(v).is($(this)); }
let removeQuery = function(v) { return !$(v).is($(this)); }
let intervalID = null;
let toggled = false;

$(document).ready(() => {

  // Begin the initial cascade.
  let setupCascade = function () {

    // Set queries and initial values.
    skillQueries["container"] = $(container);
    skillQueries["logo"] = skillQueries["container"].find(logo);
    skillQueries["text"] = skillQueries["container"].find(text);
    opacities["logo"] = 1;
    opacities["text"] = 0;

    // Setup hover event to reveal the text.
    let setupHover = () => {
      let hoverIn = function() {
        $(this).find(logo).css("opacity", 0);
        $(this).find(text).css("opacity", 1);
      };

      // Set the logo to the current state.
      let hoverOut = function() {
        $(this).find(logo).css("opacity", opacities["logo"]);
        $(this).find(text).css("opacity", opacities["text"]);
      };

      // Handle hover details.
      skillQueries["container"].hover(hoverIn, hoverOut);
    }; // setupHover()
    setupHover();

    // Setup tap event to review the text.
    let setupTap = () => {

      // Lock in state showing the text when tapped.
      let disrupt = function() {
        console.log("disrupt...");
        $(this).find(logo).css("opacity", 0);
        $(this).find(text).css("opacity", 1);
        locked.push(this);
      };

      // Unlock the state with another tap event.
      let release = function() {
        console.log("release...");
        $(this).find(logo).css("opacity", opacities["logo"]);
        $(this).find(text).css("opacity", opacities["text"]);
        locked = locked.filter(removeQuery.bind(this));
      };

      // Setup the event.
      let tapToggler = function() {
        console.log("toggling...");
        return !locked.find(hasQuery.bind(this)) ? disrupt.call(this) : release.call(this);
      }
      skillQueries["container"].on("touchstart", tapToggler);
    } // setupTap()
    setupTap();

    // Helper factory function to spit out a function to set the timeout on opacity.
    let toggleOpacity = function(newVal, mode) {
      return function(i) {

        // Prep the toggle function.
        let toggle = () => {
          console.log(locked);
          if (!$(this).parent().is(hover) && !locked.find(hasQuery.bind($(this).parent()))) {
            $(this).css("opacity", newVal);
            opacities[mode] = newVal;
          }
        };

        // Attach the toggle to an interval timer.
        setTimeout(toggle, delta * i);
      }
    } // toggleOpacity()

    // Loop over the elements and set a timer on their wave effect.
    let beginCascade = function() {

      // Controls the tide of waves so it always returns to order.
      let makeWaves = () => {

        // Checks whether each element should toggle on a cascad, then toggles.
        let cascade = () => {
          skillQueries["logo"].each(toggleOpacity(0, "logo"));
          skillQueries["text"].each(toggleOpacity(1, "text"));
        }

        // Returns the styling back to the original setup.
        let reset = () => {
          skillQueries["logo"].each(toggleOpacity(1, "logo"));
          skillQueries["text"].each(toggleOpacity(0, "text"));
        }

        // Run the relevant function, then update toggled status.
        !toggled ? cascade() : reset();
        toggled = !toggled;
      } // makeWaves()

      // Set the timers on an interval and record the interval's ID.
      intervalID = setInterval(makeWaves, interval);
    } // beginCascade()

    // Ends the given interval.
    let endCascade = () => {

        // End the cascading interval.
        clearInterval(intervalID);

        // Clean up event handlers and locked state.
        $(cButtons).off(cascadeEvent);
        skillQueries["logo"].each(toggleOpacity(1, "logo"));
        skillQueries["text"].each(toggleOpacity(0, "text"));
        locked = [];
        toggled = false;
        skillQueries["container"].off("touchstart");
        skillQueries["container"].off("mouseenter");
        skillQueries["container"].off("mouseleave");
    };

    // Begin the initial cascade effect.
    beginCascade();

    // Setup the cleanup and beginning of the next cascade.
    $(cButtons).click(function() { $(this).trigger(cascadeEvent); });
    $(cButtons).on(cascadeEvent, endCascade);

  }; // setupCascade()
  setupCascade();

  // Start a new cascade whenever the carousel slides.
  $(carousel).on("slid.bs.carousel", setupCascade);

}); //document.ready
