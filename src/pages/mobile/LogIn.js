import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Button, Form, Input, Toast} from "antd-mobile";
import {request} from "../../util/request";

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); // 切换 登录/注册

    const onSubmit = async (values) => {
        try {
            request('/login', {
                method: 'POST',
                body: JSON.stringify(values)
            })
                .then(response => {

                    localStorage.setItem('token', response);
                    localStorage.setItem('user', JSON.stringify(values)); // 缓存账号密码

                    navigate('/WorkList');
                })

        } catch (error) {
            console.log(error);
            Toast.show({content: error, duration: 2000});
        }
    };


    return (
        <div style={{padding: 20}}>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <Form onFinish={onSubmit}
                  footer={<Button block type="submit" color="primary">{isLogin ? 'Login' : 'Register'}</Button>}>
                <Form.Item name='username' label='username' rules={[{required: true, message: 'Enter UserName'}]}>
                    <Input placeholder='Please Enter UserName'/>
                </Form.Item>
                <Form.Item name='password' label='password' rules={[{required: true, message: 'Enter Password'}]}>
                    <Input placeholder='Please Enter Password'/>
                </Form.Item>
            </Form>
            <Button block fill='none' onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'No account? Register' : 'Have an account? Login'}
            </Button>
        </div>
    );
};

export default Login