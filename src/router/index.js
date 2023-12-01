import layoutAdmin from '../layout/admin/Layout'


//admin
import userAdmin from '../pages/admin/user/user'
import schoolYearAdmin from '../pages/admin/schoolYear/schoolYear'
import classAdmin from '../pages/admin/classes/classes'

//public
import login from '../pages/public/login'




const publicRoutes = [
    { path: "/", component: login},
    { path: "/login", component: login},
];

const adminRoutes = [
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
    { path: "/admin/school-year", component: schoolYearAdmin, layout: layoutAdmin },
    { path: "/admin/class", component: classAdmin, layout: layoutAdmin },
];

export { publicRoutes, adminRoutes};