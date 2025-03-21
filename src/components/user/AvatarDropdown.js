import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

const AvatarDropdown = ({ avatarUrl, onChangeAvatar, onLogout }) => {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          style={{ width: "60px", height: "60px", marginTop: "60px", cursor: "pointer" }}
          isBordered
          radius="md"
          src={avatarUrl}
          className="transition-transform hover:scale-105"
        />
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="用户操作"
        variant="bordered"
      >
        <DropdownItem 
          key="profile" 
          description="更换您的个人头像"
          onPress={onChangeAvatar}
        >
          修改头像
        </DropdownItem>
        <DropdownItem 
          key="logout" 
          className="text-danger" 
          color="danger" 
          description="退出您的账户"
          onPress={onLogout}
        >
          退出登录
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AvatarDropdown;
