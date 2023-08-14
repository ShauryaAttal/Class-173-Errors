var tableNumber = null;

AFRAME.registerComponent("marker-handlers", {
  init: async function () {
    if (tableNumber === null) {
      this.askTableNumber();
    }

    var dishes = await this.getDishes();

    this.el.addEventListener("markerFound", () => {
      if (tableNumber != null) {
        var markerId = this.el.id;
        this.handleMarkerFound(dishes, markerId);
      }
    });

    this.el.addEventListener("markerLost", () => {
      console.log("marker is lost");
      this.handleMarkerLost();
    });
  },

  handleMarkerFound: function (dishes, markerId) {
    // //var buttonDiv = document.querySelector("#button-div");
    // // buttonDiv.style.display = "flex";

    // var todayDate = new Date();
    // var todayDay = todayDate.getDay();
    // var days = [
    //   "sunday",
    //   "monday",
    //   "tuesday",
    //   "wednesday",
    //   "thursday",
    //   "friday",
    //   "saturday",
    // ];

    // var dish = dishes.filter((dish) => dish.id === markerId)[0];

    // console.log(dish);

    // if (!dish.unavailable_days.includes(days[todayDay])) {
    //   swal({
    //     icon: "warning",
    //     title: dish.dish_name.toUpperCase(),
    //     text: "The dish is not available today!",
    //     timer: 2000,
    //     buttons: false,
    //   });
    // } else {
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var ratingButton = document.querySelector("#rating-button");
    ratingButton.addEventListener("click", () => {
      swal({
        icon: "warning",
        title: "Rate The Dish",
        text: "WIP",
      });
    });

    var orderButton = document.querySelector("#order-button");
    orderButton.addEventListener("click", () => {
      var tNumber;
      tableNumber <= 5 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;
      this.orderDish(tNumber, dish);
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Order It Now",
        text: "Your order will be delivered to your table shortly!",
      });
    });

    var orderSummary = document.querySelector("#order-summary");
    orderSummary.addEventListener("click", () => {
      this.handleOrderSummary();
    });

    //   var model = document.querySelector(`model-${dish.id}`);
    //   model.setAttribute("visible", true);

    //   var mainPlane = document.querySelector(`main-plane${dish.id}`);
    //   mainPlane.setAttribute("visible", true);

    //   var pricePlane = document.querySelector(`price-plane-${dish.id}`);
    //   pricePlane.setAttribute("visible", true);
    // }
  },

  handleMarkerLost: function () {
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },

  getDishes: async function () {
    return await firebase
      .firestore()
      .collection("Dish")
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data());
      });
  },

  askTableNumber: function () {
    var iconUrl =
      "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";

    swal({
      title: "Welcome to Big Burger",
      icon: iconUrl,
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your table number here",
          type: "number",
          min: 1,
        },
      },
      closeOnClickOutside: false,
    }).then((inputValue) => {
      tableNumber = inputValue;
    });
  },

  handleOrderSummary: async function () {
    var modelDiv = document.getElementById("modal-div");
    modelDiv.style.display = "flex";

    var tableBody = document.getElementById("bill-table-body");
    tableBody.innerHTML = "";

    var myTableNumber;
    tableNumber <= 5 ? (myTableNumber = `T0${tableNumber}`) : `T${tableNumber}`;

    var orderDetails = await this.getSummary(myTableNumber);

    var currentOrders = Object.keys(orderDetails.current_orders);
    currentOrders.map((i) => {
      var tr = document.createElement("tr");
      var item = document.createAttribute("td");
      var price = document.createElement("td");
      var quantity = document.createElement("td");
      var total = document.createElement("td");

      item.innerHTML = orderDetails.current_orders[i].item;
      price.innerHTML = "$" + orderDetails.current_orders[i].price;
      quantity.innerHTML = orderDetails.current_orders[i].quantity;
      total.innerHTML = orderDetails.current_orders[i].total_bill;

      price.setAttribute("class", "text-center");
      quantity.setAttribute("class", "text-center");
      total.setAttribute("class", "text-center");
    });

    var toTalTr = documet.createElement("tr");
    var td1 = document.createElement("td");
    td1.setAttribute("class", "no-line");

    var td2 = document.createElement("td");
    td2.setAttribute("class", "no-line");

    var td3 = document.createElement("td");
    td3.setAttribute("class", "no-line text-center");

    var strongTag = document.createElement("strong");
    strongTag.innerHTML = "Total";
    td3.appendChild(strongTag);

    var td4 = document.createElement("td");
    td4.setAttribute("class", "no-line text-right");
    td4.innerHTML = "$" + orderSummary.total_bill;
  },

  getSummary: async function (tableNumber) {
    return await firebase
      .firestore()
      .collection("Tables")
      .doc(tableNumber)
      .get()
      .then((doc) => doc.data);
  },

  orderDish: function (tableNumber, dishes) {
    return firebase
      .firestore()
      .collection("Tables")
      .doc(tableNumber)
      .get()
      .then((doc) => {
        var tableDetails = doc.data();
        if (tableDetails["current_orders"][dish.id]) {
          tableDetails["current_orders"][dish.id]["Total_quantity"] += 1;

          var currentQuant =
            tableDetails["current_orders"][dish.id]["Total_quantity"];
          tableDetails["current_orders"][dish.id]["Total_bill"] =
            currentQuant * dish.price;
        } else {
          tableDetails["current_orders"][dish.id] = {
            Item: dish.dishname,
            Price: dish.price,
            Total_quantity: 1,
            Total_bill: dish.price * 1,
          };
        }
        tableDetails.total_bill += dish.price;
        firebase
          .firestore()
          .collection("Tables")
          .doc(doc.id)
          .update(tableDetails);
      });
  },
});
