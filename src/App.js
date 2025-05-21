import './App.css';
import { AuthProvider } from "./pages/web/login/AuthContext";
import PrivateRoute from "./pages/web/login/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/mobile/LogIn";
import Home from './pages/web/Home';
import Work_List from './pages/mobile/WorkList';
import WorkDetail_UpDownMove from './pages/mobile/WorkDetail/UpDownMove/UpDownMove';
import History from './pages/mobile/WorkDetail/UpDownMove/History';
import NotFound from './pages/web/login/NotFoundPage'
import LayoutComponent from './components/LayoutComponent';
import InventoryTable from './pages/web/updownmove/UpDownMoveList';
import UpLoadExcel from './pages/web/upload/ExcelUpLoader';
import WorkDetail_MergeLocation_Detail from './pages/mobile/WorkDetail/MegerLocation/MergeLocationDetail';
import WorkDetail_MergeLocation_list from './pages/mobile/WorkDetail/MegerLocation/MergeLocationList';
import OldestSku from './pages/mobile/WorkDetail/OldestSku/OldestSku';

import MergePalletResult from "./pages/web/MergePalletResult";
import PickingResult from "./pages/web/picking/PickingResult";
import WorkDetail_MergePallet_list from './pages/mobile/WorkDetail/MergePallet/MergePalletList';
import WorkDetail_MergePallet_detail from './pages/mobile/WorkDetail/MergePallet/MergePalletDetail';
import MergeLocationResult from "./pages/web/MergeLocationResult";
import MixingLocation from './pages/mobile/WorkDetail/MixingLocation/MixingLocation';
import Empty_Location from './pages/mobile/WorkDetail/EmptyLocation/EmptyLocation';
import Picking_Details from './pages/web/picking/PickingDetails';
import LocationVisualization from './pages/web/visualization/VisualizationPage';
import PickingIntervalLineChart from './pages/web/picking/PickingInterval_AllData';
import WebLogin from './pages/web/login/Login';
import UpdownDetail from "./pages/web/updownmove/updownDetail";
import UserManagement from "./pages/web/user/UserList.js";
import DoubleWeekCheckList from './pages/mobile/WorkDetail/DoubleWeek/doubleWeekCheck'
import MergeHistory from './pages/web/MergeLocation/MergeLocationHistory'
import CheckedList from './pages/web/biweeklyCheck/CheckedList'
import  MergePalletHistory from './pages/web/mergePallet/MergePalletHistory'

function App() {
    const isMobile = window.innerWidth <= 768;

    return (
        // Ensure that Router wraps the whole App
        <Router>
            <AuthProvider>
                {isMobile ? (
                    <Routes>
                        {/* All mobile routes should be wrapped in <Routes> */}
                        <Route path='/login' element={<Login />} />
                        <Route path='/home' element={<Home />} />
                        <Route path='/history' element={<History />} />
                        <Route path='/WorkList' element={<Work_List />} />
                        <Route path='/WorkDetail_UpDownMove' element={<WorkDetail_UpDownMove />} />
                        <Route path='/WorkDetail_MergeLocation/:sku/:key' element={<WorkDetail_MergeLocation_Detail />} />
                        <Route path='/WorkDetail_MergeLocation/:sku' element={<WorkDetail_MergeLocation_Detail />} />
                        <Route path='/WorkDetail_MergeLocation_list' element={<WorkDetail_MergeLocation_list />} />
                        <Route path='/WorkDetail_MergePallet/:sku/:key' element={<WorkDetail_MergePallet_detail />} />
                        <Route path='/WorkDetail_MergePallet_list' element={<WorkDetail_MergePallet_list />} />
                        <Route path='/OldestSkuList' element={<OldestSku />} />
                        <Route path='/Mixing_Location' element={<MixingLocation />} />
                        <Route path='/Empty_Location' element={<Empty_Location />} />
                        <Route path='/double_week_check' element={<DoubleWeekCheckList />} />

                        <Route path='*' element={<Login />} />
                    </Routes>
                ) : (
                    <Routes>
                        {/* Routes outside of LayoutComponent */}
                        <Route path="/" element={<WebLogin />} />
                        <Route path="*" element={<NotFound />} />

                        {/* LayoutComponent wrap */}
                        <Route element={<LayoutComponent />}>
                            <Route path="/up-down-move" element={<InventoryTable />} />
                            <Route path="/upLoadExcel" element={<UpLoadExcel />} />
                            <Route path="/picking_record" element={<PickingResult />} />
                            <Route path="/mergePallets" element={<MergePalletResult />} />
                            <Route path="/MergeLocationResult" element={<MergeLocationResult />} />
                            <Route path="/upDownMoveDetail" element={<UpdownDetail />} />
                            <Route path="/LocationVisualization" element={<LocationVisualization />} />
                            <Route path="/picking_details/:month/:account" element={<Picking_Details />} />
                            <Route path="/picking_interval" element={<PickingIntervalLineChart />} />
                            <Route path="/user" element={<UserManagement />} />
                            <Route path="/mergeHistory" element={<MergeHistory/>} />
                            <Route path="/doubleWeekCheck" element={<CheckedList/>} />
                            <Route path="/mergePalletHistory" element={<MergePalletHistory/>} />

                        </Route>
                    </Routes>
                )}
            </AuthProvider>
        </Router>
    );
}

export default App;
