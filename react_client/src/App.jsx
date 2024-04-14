/**
 * Cliente React realizado por: Jhusef Alfonso López Parra
 */
import Register from "./components/Register";
import Login from "./components/Login";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import AuthBlock from "./components/AuthBlock";
import NaviComponent from "./components/NaviComponent";
import Overview from "./components/Overview";
import Categories from "./components/CategoryComponent/Categories";
import Analytics from "./components/Analytics";
import Profile from "./components/Profile";
import History from "./components/HistoryComponent/History";
import MailingSchemas from "./components/MailingSchemasComponent/MailingSchemas";
import MailingSchemaForm from "./components/MailingSchemasComponent/MailingSchemaForm";
import CategoryForm from "./components/CategoryComponent/CategoryForm";
import Order from "./components/OrderComponent/Order";

const ROLES = {
  User: "user",
  Editor: "editor",
  Admin: "admin",
};

const PUBLIC = [
  {
    path: '/',
    component: <Login />
  },
  {
    path: '/login',
    component: <Login />
  },
  {
    path: '/register',
    component: <Register />
  }
];

const PROTECT = [
  {
    path: '/',
    component: <Overview />
  },
  {
    path: '/overview',
    component: <Overview />
  },
  {
    path: '/analytics',
    component: <Analytics />
  },
  {
    path: '/emails',
    component: <MailingSchemas />
  },
  {
    path: '/emails/:id',
    component: <MailingSchemaForm />
  },
  {
    path: '/history',
    component: <History />
  },
  {
    path: '/order',
    component: <Order />
  },
  {
    path: '/order/:id',
    component: <Order />
  },
  {
    path: '/categories',
    component: <Categories />
  },
  {
    path: '/categories/:id',
    component: <CategoryForm />
  },
  {
    path: '/profile',
    component: <Profile />
  }
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {PUBLIC.map((p, i) => (
          <Route key={i} path={p.path} element={<AuthBlock children={p.component} />} />
        ))}
        {PROTECT.map((p, i) => (
          <Route key={i} element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />} >
            <Route path={p.path} element={<NaviComponent children={p.component} />} />
          </Route>
        ))}
        <Route path="*" element={<Layout />} />
      </Route>
    </Routes>
  );
}

export default App;
