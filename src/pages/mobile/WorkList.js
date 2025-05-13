import {Badge, Button, Footer, NavBar, NoticeBar, Space, TabBar, Toast} from 'antd-mobile';
import {useNavigate} from 'react-router-dom';
import {
    AntOutline, AppOutline, CalculatorOutline,
    HistogramOutline, MessageFill, MessageOutline,
    TransportQRcodeOutline,  EyeOutline,
    TruckOutline,
    UnorderedListOutline, UserOutline
} from "antd-mobile-icons";
import {useEffect, useState} from "react";
import {request} from "../../util/request";

const JobSelection = () => {
    const navigate = useNavigate();
    const [mixingLocationQty, setMixingLocationQty] = useState([]);
    const [emptyLocationQty, setEmptyLocationQty] = useState([]);
    const [date, setDate] = useState([]);
    const iconContainerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        width: "33%",
        marginBottom: 20,
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                request('/mixingLocation').then(response=>{
                    setMixingLocationQty(response);
                })

                // request('/emptyLocationList').then(response=>{
                //     setEmptyLocationQty(response);
                // })

                request('/getDate').then(response=>{
                    setDate(response.date);
                })

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
            title: '首页',
            icon: <AppOutline />,
            badge: Badge.dot,
        },
        {
            key: 'todo',
            title: '待办',
            icon: <UnorderedListOutline />,

        },
        {
            key: 'message',
            title: '消息',
            icon: (active: boolean) =>
                active ? <MessageFill /> : <MessageOutline />,

        },
        {
            key: 'personalCenter',
            title: '我的',
            icon: <UserOutline />,
        },
    ]

    return (
        <div>
            <NavBar
                back={null} right={<Button size="small" onClick={handleLogout}>Log out</Button>}
            >
                Work Type
            </NavBar>
            <div style={{padding: 20, textAlign: 'center'}}>
                <NoticeBar content={`The result is based on the Excel data uploaded on ${date}`} color="alert" />

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
                            <span style={{fontSize: 12, marginTop: 4}}>Oldest SKU</span>
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

                            <span style={{fontSize: 12, marginTop: 4}}>Empty Location</span>
                        </div>

                        <div style={iconContainerStyle}
                             onClick={() =>navigate('/double_week_check')}>

                            <EyeOutline fontSize={48} color='var(--adm-color-success)'/>

                            <span style={{fontSize: 12, marginTop: 4}}>Double Week</span>
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
