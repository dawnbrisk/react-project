
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const SideMenu = () => {
    const location = useLocation();

    return (
        <Sider width={220} className="site-layout-background">
            <Menu mode="inline" defaultSelectedKeys={[location.pathname]} style={{ height: '100%', borderRight: 0 }}>
                <Menu.SubMenu key="locationManage" title="Location Management">

                    <Menu.Item key="/up-down-move">
                        <Link to="/up-down-move">Up Down Move</Link>
                    </Menu.Item>

                    <Menu.Item key="/upLoadExcel">
                        <Link to="/upLoadExcel">UpLoad Excel</Link>
                    </Menu.Item>

                    <Menu.Item>
                        <Link to="/picking_record">Picking Record</Link>
                    </Menu.Item>
                    <Menu.Item key="/MergeLocationResult">
                        <Link to="/MergeLocationResult">Merge Location Result</Link>
                    </Menu.Item>
                    <Menu.Item key="/mergePallets">
                        <Link to="/mergePallets">Merge Pallet Result</Link>
                    </Menu.Item>
                </Menu.SubMenu>


                <Menu.SubMenu  title=" Visualization">
                    <Menu.Item key="/LocationVisualization">
                        <Link to="/LocationVisualization">Location Visualization</Link>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        </Sider>
    );
};

export default SideMenu;
