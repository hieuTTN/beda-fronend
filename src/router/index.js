import layoutAdmin from '../layout/admin/Layout'


//admin
import userAdmin from '../pages/admin/user/user'






const adminRoutes = [
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
];

export { adminRoutes};