'use client';

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button, Input, Checkbox, Link, Form, Card, CardBody, addToast } from "@heroui/react";
import { useMediaQuery } from "react-responsive";
import api from '../../axios/api';
import GradientBackground from '../../components/background/GradientBackground';


export const EyeSlashFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
        fill="currentColor"
      />
      <path
        d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
        fill="currentColor"
      />
      <path
        d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
        fill="currentColor"
      />
      <path
        d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
        fill="currentColor"
      />
      <path
        d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const EyeFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
        fill="currentColor"
      />
      <path
        d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isRemember, setIsRemember] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    identifier: '',
    password: ''
  });

  // 响应式断点定义
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  
  // 根据设备类型定义样式变量
  const containerPadding = isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-8';
  const inputHeight = isMobile ? 'h-10' : 'h-12';
  const buttonHeight = isMobile ? 'h-10' : isTablet ? 'h-11' : 'h-12';
  const iconSize = isMobile ? 'text-xl' : 'text-2xl';
  const labelSize = isMobile ? 'text-xs' : 'text-sm';
  const buttonSize = isMobile ? 'sm' : isTablet ? 'md' : 'lg';

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  }

  // 组件加载时检查是否有保存的账户信息并填充表单
  useEffect(() => {
    const savedCredentials = localStorage.getItem('remember_credentials');
    
    if (savedCredentials) {
      try {
        const credentials = JSON.parse(savedCredentials);
        setFormValues({
          identifier: credentials.identifier || '',
          password: credentials.password || ''
        });
        setIsRemember(true); // 自动勾选"记住我"选项
      } catch (error) {
        console.error("解析保存的登录信息失败", error);
        localStorage.removeItem('remember_credentials');
      }
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const identifier = formData.get('identifier');
    const password = formData.get('password');
    const remember = formData.get('remember') !== null;

    try {
      const response = await api.user.login(identifier, password);
      if (response.code === 200) {
        // 如果勾选了"记住我"，保存账户密码到本地存储
        if (remember) {
          localStorage.setItem('remember_credentials', JSON.stringify({
            identifier: identifier,
            password: password
          }));
        } else {
          // 如果未勾选，则清除之前可能保存的信息
          localStorage.removeItem('remember_credentials');
        }

        // 登录成功添加提示
        addToast({
          title: "登录成功",
          description: "正在跳转到首页...",
          color: "success",
          timeout: 2000,
        });

        // 延迟跳转，确保状态被正确保存
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        console.error("登录失败", response);
        addToast({
          title: "登录失败",
          description: "请检查您的用户名和密码",
          color: "danger",
          timeout: 3000,
        });
      }
    } catch (error) {
      console.error("登录请求出错", error);
      addToast({
        title: "登录请求出错",
        description: "请稍后再试",
        color: "danger",
        timeout: 3000,
      });
    }
  };

  return (
    <div className={`relative flex items-center justify-center w-full h-screen overflow-hidden bg-black ${containerPadding}`}>
      <GradientBackground />

      {/* 内容区域 */}
      <div className="relative z-10 flex w-full h-full items-center justify-center">
        <Card className={`${isMobile ? 'w-[95%]' : isTablet ? 'w-[75%]' : 'w-full'} max-w-sm transition-all duration-300 ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
          <CardBody className={`flex flex-col gap-${isMobile ? '3' : '4'} rounded-large px-${isMobile ? '4' : isTablet ? '6' : '8'} pb-${isMobile ? '8' : '10'} pt-${isMobile ? '5' : '6'}`}>
            <p className={`pb-${isMobile ? '2' : '4'} text-left text-${isMobile ? 'xl' : '2xl'} font-semibold`}>
              登录
              <span aria-label="emoji" className="ml-2" role="img">
                👋
              </span>
            </p>
            <Form className={`flex flex-col gap-${isMobile ? '3' : '4'}`} validationBehavior="native" onSubmit={handleSubmit}>
              <Input
                isRequired
                label="用户名 / 邮箱"
                labelPlacement="outside"
                name="identifier"
                placeholder="请输入用户名 / 邮箱"
                variant="bordered"
                className={`text-${isMobile ? 'sm' : 'base'} ${inputHeight}`}
                size={isMobile ? "sm" : "md"}
                value={formValues.identifier}
                onChange={(e) => setFormValues({...formValues, identifier: e.target.value})}
              />

              <Input
                className={`text-${isMobile ? 'sm' : 'base'} ${inputHeight}`}
                size={isMobile ? "sm" : "md"}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className={`${iconSize} text-default-400 pointer-events-none`} />
                    ) : (
                      <EyeFilledIcon className={`${iconSize} text-default-400 pointer-events-none`} />
                    )}
                  </button>
                }
                isRequired
                labelPlacement="outside"
                name="password"
                label="密码"
                placeholder="请输入密码"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                value={formValues.password}
                onChange={(e) => setFormValues({...formValues, password: e.target.value})}
              />

              <div className={`flex w-full ${isMobile ? 'flex-col gap-2' : 'items-center justify-between'} px-1 py-${isMobile ? '1' : '2'} text-${isMobile ? 'xs' : 'sm'}`}>
                <Checkbox 
                  name="remember" 
                  size={isMobile ? "xs" : "sm"}
                  isSelected={isRemember}
                  onValueChange={setIsRemember}
                >
                  <span className={labelSize}>记住我</span>
                </Checkbox>
                <Link className={`text-default-500 ${labelSize}`} href="#" size={isMobile ? "xs" : "sm"}>
                  忘记密码?
                </Link>
              </div>
              <Button 
                className={`w-full text-${isMobile ? 'sm' : 'base'} ${isMobile ? 'mt-1' : 'mt-2'} ${buttonHeight}`}
                color="primary" 
                type="submit"
                size={buttonSize}
              >
                登录
              </Button>
            </Form>
            <p className={`text-center text-${isMobile ? 'xs' : 'sm'} mt-${isMobile ? '2' : '4'}`}>
              <Link href="/register" size={isMobile ? "xs" : "sm"}>
                创建账户
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
