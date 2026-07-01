import { Routes ,Route, Navigate } from "react-router-dom";
import { CompanyList } from "./pages/companyListPage";
import { CompanyPage } from "./pages/companyPage";
import { SignUp } from "./pages/auth/signUp";
import { SignIn } from "./pages/auth/signIn";
import { UserPortfolio } from "./pages/portflioPage";
import { UserLedger } from "./pages/ledgerPage";


function App() {
  return (
    <Routes>
      <Route path = "/" element = {<Navigate to="/home/register" />} />
      <Route path = "/home" element = {<CompanyList />} />
      <Route path = "/company/:companyId" element = {<CompanyPage />} />
      <Route path = "/home/register" element = {<SignUp />} />
      <Route path = "/home/signin" element = {<SignIn />} />
      <Route path = "/user/portfolio" element = {<UserPortfolio />}></Route>
      <Route path = "/user/transactions" element = {<UserLedger />}></Route>
    </Routes>
  );
}

export default App;