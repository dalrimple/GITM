(function() {
  var $submit; //The top 10 submit button. Not the final form submit button
  var $cancel; //The button that cancels the submission form and allows users to go back to editing their top 10
  var $thankyou; //The thankyou message DOM element
  //Other interactive elements are handled by their respective function javascript (playerGrid.js, positionFilters.js, etc...)

  window.app = {
    //Set some basic click handlers and kick everything off
    init: function() {
      $('input, textarea').placeholder();//Polyfill for the HTML5 placeholder attribute on older browsers

      $submit = $("#submit-selection")
        .prop("disabled", true)
        .click(function(e) {
          e.preventDefault();
          app.lockSelection();
        });
      $cancel = $("#cancel-submit")
        .prop("disabled", true)
        .click(function(e) {
          e.preventDefault();
          app.unlockSelection();
        });
      $thankyou = $("#thankyou"); //This is hidden by inline css

      app.playerGrid.init();
      app.draftForm.init();
      app.timer.init();
      app.positionFilters.init();
      app.selectionGrid.init();

    },
    //This is called by selectionGrid.js whenever the top 10 changes. It validates the top 10 and sends true or fals for isReady
    selectionReady: function(isReady) {
      // console.log("the selection is", isReady ? "ready" : "NOT ready");
      if (isReady) {
        app.playerGrid.disable();
        $submit.prop("disabled", false);
      } else {
        app.playerGrid.enable();
        $submit.prop("disabled", true);
      }
    },
    //Once a user is happy with their top 10 and hits submit, this locks the selection ready for submission
    lockSelection: function() {
      $submit.hide();
      $cancel.prop("disabled", false);
      app.playerGrid.disable(); //Not strictly necessary as it is hidden in the next line.
      app.playerGrid.hide();
      app.positionFilters.hide();
      app.draftForm.show();
      app.selectionGrid.disable();
    },
    unlockSelection: function() {
      $submit.show();
      $cancel.prop("disabled", true);
      if (!app.selectionGrid.getSelectionReady()) { //Check if the top 10 is full. If not, re-enable the player grid. Note, drag and drop is always enabled.
        app.playerGrid.enable();
      }
      app.playerGrid.show();
      app.positionFilters.show();
      app.draftForm.hide();
      app.selectionGrid.enable();
    },
    thankyou: function() { //Called once the form is successfully submitted.
      app.draftForm.hide();
      app.timer.hide(); //This may need to be hidden and shown along with the positionFilters instead.
      app.selectionGrid.hide();
      $thankyou.show();
    },
    autoSelect: function() { //Instead of having to manually select a top ten during testing. type app.autoSelect() in the console
      var count = 10;
      $("#player-grid .player").each(function(i) {
        if (!$(this).data("disabled")) {
          count--
          app.selectionGrid.putPlayerInNextCell($(this));
        }
        if (!count) return false;
      });
    }
    
  };
})();

$(document).ready(function() {
  app.init();
});
