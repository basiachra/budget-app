
/*modules
var egzController = (function(){
/*
    //prywatne
    var x = 23;
    var add = function(a){
        return x + a;
    }


    //publiczne

    //zwracanie obiektu zawierającego funkcje
    //które mogą być użyte poza scopem
    return{
        publicTest: function(b){
            console.log(add(b));
        }
    }

    //budgetController.publicTest(5) - działa
    //budgetController.add(5) - nie działa

})();*/

var budgetController = (function(){



})();


var UIController = (function(){



})();

//przesyłamy parametry -- łączymy moduły
var controller = (function(budgetCtrl, UICtrl){


    var ctrlAddItem = function(){
        //1.get the field input data

        //2.add the item to budget controller

        //3.add the item to UI

        //4.calculate budget

        //5.Display the budget on the UI
    };


    document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);

    document.addEventListener('keypress', function(event){

        if(event.keyCode === 13 || event.which === 13)
            ctrlAddItem();

    });



})(budgetController,UIController);