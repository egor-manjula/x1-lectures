'use strict';
window.addEventListener('load', onWindowLoad);

function onWindowLoad() {
    var todoFormt = new TodoMVC('#todo-template');
    TodoMVC.prototype = {};

    var TodoMVC = {
        todoList: [],

        addTodo: function(todoText) {

            var todo = {
                text: todoText,
                done: false
            };

            // this = TodoMVC
            this.todoList.push(todo);

            // Called implicitly
            // TodoMVC.render();
            this.render();
        },

        removeTodo: function(index) {
            this.todoList.splice(index, 1);
        },

        clearCompleted: function() {
            console.log('Should clear all completed items');

            // TODO: Optimize multiple render call
            this.todoList.forEach(function(todo, index, array) {
                if (todo.done) {
                    this.removeTodo(index);
                }
            }, this);

            this.render();
        },

        render: function() {
            // this === TodoMVC
            var todoListContainer = document.querySelector('#todo-list');
            // Clear the list
            todoListContainer.innerHTML = '';

            //[{
            //      text: 'Test 1',
            //      done: false
            // }, {
            //      text: 'Test 2',
            //      done: false
            // }, {
            //      text: 'Test 3',
            //      done: false
            // }]

            this.todoList.forEach(function(todo, index, todoList) {
                // todo = {
                //  text: 'Test 1',
                //  done: false
                // }

                // <li>First one</li>
                var todoElement = document.createElement('li');
                todoElement.innerHTML = todo.text;

                if (todo.done) {
                    todoElement.className += ' done';
                }

                var todoDoneElement = document.createElement('input');
                todoDoneElement.type = 'checkbox';
                todoDoneElement.checked = todo.done; // true/false

                todoDoneElement.addEventListener('change', (function() {
                    todo.done = todoDoneElement.checked;
                    this.render();
                }).bind(this));

                // <span>x</span>
                var closeSpan = document.createElement('span');
                closeSpan.innerHTML = '×';

                closeSpan.addEventListener('click', (function() {
                    closeSpan.parentNode.remove();

                    this.removeTodo(index);
                    this.render();
                }).bind(this));

                // <li>First one<span>x</span></li>
                todoElement.appendChild(todoDoneElement);

                // <li>First one<span>x</span></li>
                todoElement.appendChild(closeSpan);

                // <ul><li>First one<span>x</span></li></ul>
                todoListContainer.appendChild(todoElement);
            }, this);

            var activeItemsLeft = document.querySelector('#active-items-left');
            activeItemsLeft.innerHTML = this.todoList.filter(function(todo) {
                return !todo.done;
            }).length;
        }
    };

    // Make TodoMVC global
    window.TodoMVC = TodoMVC;

    // Input
    document.querySelector('#todo-text').addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            TodoMVC.addTodo(this.value);
            this.value = '';
        }
    });

    // Clear all completed button
    document.querySelector('#clear-completed').addEventListener('click', function() {
       TodoMVC.clearCompleted();
    });
}
