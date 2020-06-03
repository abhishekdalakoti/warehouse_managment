`Backend`
There are three tables desgined for this assignment

Table 1 warehouse_contents-
This table will have the information regarding all the types of item in the warehouse like inventory or container
Id:unique autoincrement
name:container/inventory
This will have a barcode intentifier field as to provide a level of abstraction  and store the same digits in inventory type . To get the barcode of the paticular item a join can be applied

Table 2 container
This will have all the containers in the warehouse

Id:unique autoincrement,
hold_type:id of table warehouse_content(Wether it holds inventory or container )
label:a lable for the container
hold_ids: all the ids of things it directly holds
parent:its parent container


Table 3: inventory
This will have al the inventory in warehouse
Assumption that an inventory dosent hold another inventory else it would be called a container
label:a lable for the container
parent:its parent container

Note this design can be used for extensibility and for expanding in future needs 
IF we need to add some sort of feature like something like rack or another thing .

`Client`
