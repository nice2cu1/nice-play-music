import { Card, CardBody, CardHeader, Avatar, Button } from "@heroui/react";
import useUserStore from '../../store/useUserStore';

const UserProfileCard = () => {
  const { user } = useUserStore();

  if (!user) {
    return null;
  }

  return (
    <Card className="max-w-md">
      <CardHeader className="flex gap-3">
        <Avatar src={user.avatar} size="lg" />
        <div className="flex flex-col">
          <p className="text-md">{user.nickname || user.username}</p>
          <p className="text-small text-default-500">{user.email}</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-default-500">ID:</span>
            <span>{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-default-500">用户名:</span>
            <span>{user.username}</span>
          </div>
          {user.nickname && (
            <div className="flex justify-between">
              <span className="text-default-500">昵称:</span>
              <span>{user.nickname}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-default-500">邮箱:</span>
            <span>{user.email}</span>
          </div>
          {user.createdAt && (
            <div className="flex justify-between">
              <span className="text-default-500">注册时间:</span>
              <span>{new Date(user.createdAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default UserProfileCard;
