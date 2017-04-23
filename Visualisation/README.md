Open the index.html with Firefox.

### Tree
On the left there is a tree with all the nodes that represent the if statement and loops. The system will expand the apropriate note while the i increments. When an if statement is activated in the logic it calls the expand method inside the tree2.js to expand the notes and mark them with red color. 

### Tables
The top table will illustrate the changes on our data as the i increments when we press the next button.When a line is deleted it will be marked as red on the table. When a line receives the value of FIRSR it will be green and yellow when its LAST

The i is 0 when we first launch the index.html. The table on the bottom will represent the final outcome when the i is finally equal with the dataset size.

In the following days i might change the second table to show the rows that were affected when you click the apropriate node.
I will try to create a new view that filter the resutls and tables based on the actual routes if i have time. Instead of showing what happens while i changes i will try to show the actual routes and what happens while the system creates them.


### NOTE
The tables are fully implemented. They can show all the changes while i changes. For now i managed to expand only the first node when i=1. I am currently working on it and i will finish it until the end of the day. Please review my visualisation and i will expect feedback whenever you can. If you dont like anything or you want me to change anything please let me know.

### The main files that i work with for now are the following:

- logic.js
- table.js
- tree2.js

- index.html
- style.css


## To DO

- [ ] Scroll the table to the current line every time i changes
- [ ] fix the style to fit in every browser
- [ ] there are methods in the logic that are not fully implemented
- [ ] implement the previous button


## DOING

- [ ] Implementing the expand method in tree2.js to expand every node when its activated while the i is changing in the logic.js file

## DONE
