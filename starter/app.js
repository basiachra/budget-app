
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

    //1.data model
    var Income = function(id, description, value){
        this.id = id;
        this.description  = description;
        this.value = value;
    };

    var Expence = function(id, description, value){
        this.id = id;
        this.description  = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0,
        },
        budget : 0,
        percentage: -1
    };

    var calculateTotal = function(type){
        var sum = 0;

        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    return{
        addItem: function(type, des, val){
            var newItem;

            //create new ID

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }else ID = 0;


            //Create new exp/inc object
            if(type === 'exp') {
                newItem = new Expence(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            //Add object to data structure
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function(){

            //calculate total income and expences
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate budget : inc - exp

            data.budget = data.totals.inc - data.totals.exp;

            //calculate percentage of expences

            if(data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else
                data.percentage = -1;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp : data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    };

})();


var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage"
    };

    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMStrings.inputType).value, //inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItem: function(obj,type){
            var html, newHtml,element;
            //create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder text with data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);



            //insert into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function(){

            var fields,fieldsArray;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            ///zwraca z listy tablicę

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current/*, index, array*/){
               current.value = "";
            });

            fieldsArray[0].focus();

        },
        displayBudget: function(obj){

            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

            if(obj.percentage > 0)
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;
            else
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
        },


        getDOMStrings: function(){
            return DOMStrings;
        }
    };


})();

//przesyłamy parametry -- łączymy moduły
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event){

            if(event.keyCode === 13 || event.which === 13)
                ctrlAddItem();

        });
    };

    var updateBudget = function(){

        //1.calculate budget
        budgetCtrl.calculateBudget();

        //2.Return the budget
        var budget = budgetCtrl.getBudget();

        //3.Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function(){

        var input, newItem;

        //1.get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

            //2.add the item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3.add the item to UI
            UICtrl.addListItem(newItem, input.type);

            //4.clear the fields
            UICtrl.clearFields();

            //Calculate and update budget
            updateBudget();
        }
    };

    return{
        init: function(){
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp : 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }


})(budgetController,UIController);

controller.init();


//86