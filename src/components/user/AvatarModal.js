import { useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Avatar, addToast } from "@heroui/react";

const AvatarModal = ({ isOpen, onClose, avatarPreview, tempAvatarUrl, isUploading, onSave, onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader className="border-b border-gray-200">
          <h4 className="text-base font-medium text-gray-800">头像设置</h4>
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="space-y-6">
            {/* 隐藏的文件输入框 */}
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept=".jpg,.jpeg,.png"
              onChange={onFileSelect}
            />
            
            {/* 当前头像预览 */}
            <div className="flex flex-col items-center gap-4">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleFileClick}
              >
                <Avatar
                  src={tempAvatarUrl || avatarPreview}
                  className="w-full h-full"
                  alt="头像预览"
                />
              </div>
              
              <Button
                color="primary"
                variant="light"
                size="sm"
                onPress={handleFileClick}
              >
                选择新头像
              </Button>
              
              <div className="text-sm text-gray-500 text-center">
                支持上传JPG、PNG格式图片，文件大小不超过5MB。
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-gray-200">
          <Button
            color="default"
            variant="light"
            onPress={onClose}
          >
            取消
          </Button>
          <Button
            color="primary"
            isLoading={isUploading}
            isDisabled={isUploading || !tempAvatarUrl || tempAvatarUrl === avatarPreview}
            onPress={onSave}
          >
            {isUploading ? "保存中..." : "保存更改"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AvatarModal;
