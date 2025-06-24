import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
function CmRouteChangeNotifier() {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

   useEffect(() => {
    console.log(user);
    // alert("user",user);
    if (window.Android && window.Android.loginCheck) {
      window.Android.loginCheck(JSON.stringify({
        type: "ROUTE_CHANGE",
        path: location.pathname,
        userId: user?.usersId
      }));
    }
  }, [location]);

  return null;
}

export default CmRouteChangeNotifier;