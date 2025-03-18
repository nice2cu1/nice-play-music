'use client';
import { Button } from '@heroui/button';

export default function Login() {
const handleLogin = () => {
    document.cookie = 'isLogin=1';
    window.location.href = '/';
}
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-50">
      <div className="w-full flex flex-row justify-center items-center gap-4"> {/* 使用 flex 布局和 gap-6 类 */}
        <Button className="">Login</Button>
        <Button className="" onPress={handleLogin} >Login！！！</Button>
      </div>
    </div>
  );
}
