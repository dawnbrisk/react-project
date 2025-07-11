import {Badge, Button, WaterMark , NavBar, NoticeBar, Space, TabBar, Toast} from 'antd-mobile';
import {useNavigate} from 'react-router-dom';
import {
    AntOutline, AppOutline, CalculatorOutline,
    HistogramOutline, MessageFill, MessageOutline,
    TransportQRcodeOutline,  EyeOutline,
    TruckOutline,LocationOutline ,
    UnorderedListOutline, UserOutline
} from "antd-mobile-icons";
import {useEffect, useState} from "react";
import {request} from "../../util/request";
import  useAuthRedirect from "./useAuthRedirect"

const JobSelection = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const authenticated =useAuthRedirect();

    const navigate = useNavigate();
    const [mixingLocationQty, setMixingLocationQty] = useState([]);
    const [date, setDate] = useState([]);
    const iconContainerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        width: "33%",
        marginBottom: 20,
    };

    const [username, setUsername] = useState('');
    const [props, setProps] = useState({ content: 'WareHouse NW' });

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const userObj = JSON.parse(userStr);
            const username = userObj.username;
            setUsername(username);
            // 把 username 赋值给水印content
            setProps({ content: `User: ${username}` });
        }
    }, []);



    useEffect(() => {
        //if (!authenticated) return;
        const fetchData = async () => {
            try {
                const mixingResponse = await request('/mixingLocation', { method: 'GET' });
                setMixingLocationQty(mixingResponse);

                const dateResponse = await request('/getDate', { method: 'GET' });
                setDate(dateResponse.date);
            } catch (error) {
                Toast.show('Failed to fetch data');
                console.error('Error fetching data:', error);
            }
        };


        fetchData();
    }, []);



    const handleLogout = () => {
        Toast.show({content: 'Logged out'});
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // 移除缓存的账号密码
        localStorage.removeItem('jobType');
        navigate('/login');
    };

    const tabs = [
        {
            key: 'home',
            icon: <AppOutline />,
            badge: Badge.dot,
        },

        {
            key: 'personalCenter',
            icon: <UserOutline />,
        },
    ]

    return (
        <div>
            <WaterMark {...props} />
            <NavBar
                back={null} right={<Button size="small" onClick={handleLogout}>Log out</Button>}
            >
                Work Type
            </NavBar>
            <div style={{padding: 20, textAlign: 'center'}}>
                <NoticeBar content={`Excel data uploaded on ${date}`} color="alert" />

                <Space direction="vertical" block>

                    <div style={{
                        display: "flex",
                        flexWrap: "wrap", // Allow the items to wrap to the next line
                        justifyContent: "flex-start", // Align items to the left if there are fewer than 3
                        alignItems: "center",
                        width: "100%", // Make it span the full width
                    }}>
                        <div  style={iconContainerStyle}
                             onClick={() => navigate('/WorkDetail_MergeLocation_list')}>
                            <TruckOutline fontSize={48} color='var(--adm-color-danger)'/>
                            <span style={{fontSize: 12, marginTop: 4}}>Merge Location</span>
                        </div>

                        <div style={iconContainerStyle}
                             onClick={() => navigate('/WorkDetail_UpDownMove')}>
                            <UnorderedListOutline fontSize={48} color='var(--adm-color-success)'/>
                            <span style={{fontSize: 12, marginTop: 4}}>UP Down Move</span>
                        </div>

                        <div style={iconContainerStyle}
                             onClick={() =>navigate('/OldestSkuList')}>
                            <Badge content='Top 50'>
                                <HistogramOutline fontSize={48} color='var(--adm-color-primary)'/>
                            </Badge>
                            <span style={{fontSize: 12, marginTop: 4}}>Eldest SKU</span>
                        </div>

                        <div style={iconContainerStyle}
                             onClick={() =>  navigate('/WorkDetail_MergePallet_list')}>
                            <TransportQRcodeOutline fontSize={48} color='var(--adm-color-primary)'/>
                            <span style={{fontSize: 12, marginTop: 4}}>Merge Pallets</span>
                        </div>

                        <div style={iconContainerStyle}
                             onClick={() =>  navigate('/Mixing_Location')}>
                            <Badge content={mixingLocationQty.length}>
                                <AntOutline fontSize={48} color='var(--adm-color-danger)'/>
                            </Badge>
                            <span style={{fontSize: 12, marginTop: 4}}>Mixing Location</span>
                        </div>

                        <div style={iconContainerStyle}
                             onClick={() =>navigate('/Empty_Location')}>

                                <CalculatorOutline fontSize={48} color='var(--adm-color-success)'/>

                            <span style={{fontSize: 12, marginTop: 4}}>Free Location</span>
                        </div>

                        <div style={iconContainerStyle}
                             onClick={() =>navigate('/double_week_check')}>

                            <EyeOutline fontSize={48} color='var(--adm-color-success)'/>

                            <span style={{fontSize: 12, marginTop: 4}}>Biweekly Check</span>
                        </div>


                        <div style={iconContainerStyle}
                             onClick={() =>  navigate('/General_merge')}>

                                <LocationOutline fontSize={48} color='var(--adm-color-danger)'/>
                            <span style={{fontSize: 12, marginTop: 4}}>General Merge</span>
                        </div>



                        <div style={iconContainerStyle}
                             onClick={() =>  navigate('/mobileStat')}>

                            <HistogramOutline fontSize={48} color='var(--adm-color-danger)'/>
                            <span style={{fontSize: 12, marginTop: 4}}>General Merge</span>
                        </div>


                    </div>

                </Space>
            </div>

            <TabBar style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 1000 }}>
                {tabs.map(item => (
                    <TabBar.Item
                        key={item.key}
                        icon={item.icon}
                        title={item.title}
                        badge={item.badge}
                    />
                ))}
            </TabBar>


        </div>

    );
};

export default JobSelection;
