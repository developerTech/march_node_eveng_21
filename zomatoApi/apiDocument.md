//page1 (search)

> List of city
(http://localhost:9800/location)
(http://localhost:9800/list/location)

> List of restaurants
(http://localhost:9800/list/restaurants)
(http://localhost:9800/restaurants)

> List of MealType
(http://localhost:9800/list/mealType)

> Restaurants on the basis of city
(http://localhost:9800/restaurants?state_id=1)

//page 2

> Restaurants on basis of MealType
(http://localhost:9800/restaurants?meal_id=2)
> Filter on basis of Cuisine
(http://localhost:9800/filter/1?cuisineId=4)
> Filter on basis of Price
(http://localhost:9800/filter/1?lcost=500&hcost=900)
> Sort low to high/high to low
(http://localhost:9800/filter/1?sort=-1)

//page 3
> Restaurants Details
> Menu on the basis of restaurants
> List all Menu
(http://localhost:9800/list/menu)

// page 4
> menu details on basis of item
> Post the orders

// page5
> view all orders
(http://localhost:9800/list/orders)
> view orders on the basis of emailId
> update order status

//////////////Your Task/////////////////////
> Add/Delete/Update
>> City
>> Restaurants
>> MealType
>> Menu
>> orders