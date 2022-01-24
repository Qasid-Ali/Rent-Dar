import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";
import UserManage from "./components/users/UserManage";
import EditUser from "./components/users/EditUser";
import EditItem from "./components/items/EditItem";
import ItemManage from "./components/items/ItemManage";
import AddItems from "./AddItems";
import ShowItems from "./ShowItems";
import IndividualItems from "./IndividualItems";
import Favourite from "./components/favourite/Favourite";
import ManageCategory from "./components/category/ManageCategory";
import PrivateRoute from "./PrivateRoute";
import RequestItem from "./RequestItem";
import { NotFound } from "./components/NotFound";
import { AuthProvider } from "./context/AuthContext";
import Message from "./components/Message";
import Search from "./components/Search";
import SearchUser from "./components/users/SearchUser";
import UserDetail from "./components/users/UserDetail";
import ItemDetail from "./components/items/ItemDetail";
import OrderDetail from "./components/orders/OrderDetail";
import Orders from "./components/orders/Orders";
import ListingItemDetail from "./ListingItemDetail";
import ShowRequest from "./ShowRequest";
import RequestItemShow from "./components/RequestItemShow";
import UpdateProfile from "./UpdateProfile";
import Home from "./components/Home";

function App() {
  return (
    <div className="app">
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/reset" component={Reset} />
            <Route path="/home" component={Home} />
            <PrivateRoute path="/updateProfile" component={UpdateProfile} />
            <PrivateRoute path="/users" component={UserManage} />
            <PrivateRoute path="/updateUser/:id" component={EditUser} />
            <PrivateRoute path="/updateitem/:id" component={EditItem} />
            <PrivateRoute path="/userDetail/:id" component={UserDetail} />
            <PrivateRoute path="/itemDetail/:id" component={ItemDetail} />
            <PrivateRoute path="/orderDetail/:id" component={OrderDetail} />
            <PrivateRoute path="/orders" component={Orders} />
            <PrivateRoute path="/lenderRequest" component={ShowRequest} />
            <PrivateRoute path="/itemRequest" component={RequestItemShow} />
            <PrivateRoute path="/message/:id" component={Message} />
            <PrivateRoute path="/items" component={ItemManage} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/manageCategory" component={ManageCategory} />
            <PrivateRoute path="/item/:itemId" component={IndividualItems} />
            <PrivateRoute path="/addItem" component={AddItems} />
            <PrivateRoute path="/favourite" component={Favourite} />
            <PrivateRoute path="/listing" component={ListingItemDetail} />
            <PrivateRoute path="/showItem" component={ShowItems} />
            <PrivateRoute path="/search" component={Search} />
            <PrivateRoute path="/searchUser" component={SearchUser} />
            <PrivateRoute path="/requestItem" component={RequestItem} />
            <Route component={NotFound} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
