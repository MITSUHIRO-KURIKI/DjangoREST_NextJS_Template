'use client'

// react
import {
  type ReactElement,
  type Dispatch,
  type SetStateAction,
  ChangeEvent,
} from 'react';
// shadcn
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/shadcn/dialog';
import { Button } from '@/app/components/ui/shadcn/button';
import { Input } from '@/app/components/ui/shadcn/input';
import { Label } from '@/app/components/ui/shadcn/label';
// icons
import {
  Loader2,
} from 'lucide-react';
// features
import { sanitizeDOMPurify } from '@/features/utils';
import { patchRoomSettingsRoomNameChange } from '@/features/api/vrmchat';
// components
import { showToast } from '@/app/components/utils';
// include
import { type SubItem } from '../data';

// type
type RoomNameChangeDialogProps = {
  setVrmChatItems:          Dispatch<SetStateAction<SubItem[]>>;
  isVrmChatRoomSending:     boolean;
  setIsVrmChatRoomSending:  Dispatch<SetStateAction<boolean>>;
  editRoomName:             string;
  setEditRoomName:          Dispatch<SetStateAction<string>>;
  editRoomNametargetRoomId: string;
  editRoomNameModalOpen:    boolean;
  setEditRoomNameModalOpen: Dispatch<SetStateAction<boolean>>;
};

// RoomNameChangeDialog ▽
export function RoomNameChangeDialog({
    setVrmChatItems,
    isVrmChatRoomSending,
    setIsVrmChatRoomSending,
    editRoomName,
    setEditRoomName,
    editRoomNametargetRoomId,
    editRoomNameModalOpen,
    setEditRoomNameModalOpen, }: RoomNameChangeDialogProps): ReactElement {

  const handleSubmitRoomName = async (): Promise<void> => {
    if (!editRoomName || !editRoomNametargetRoomId) return;

    // 多重送信防止
    if (isVrmChatRoomSending) return;

    setIsVrmChatRoomSending(true);
    try {
      const result = await patchRoomSettingsRoomNameChange({
        roomId:   editRoomNametargetRoomId,
        sendData: {room_name: sanitizeDOMPurify(editRoomName)},
      });
      if (result.ok) {
        setVrmChatItems((prev) =>
          prev.map((item) => {
            if (item.key === editRoomNametargetRoomId) {
              return { ...item, label: editRoomName };
            };
            return item;
          })
        );
      } else {
        showToast('error', 'error');
      };
    } catch {
      showToast('error', 'error');
    } finally {
      // モーダルを閉じる
      setEditRoomNameModalOpen(false);
      // 多重送信防止
      setIsVrmChatRoomSending(false);
    };
  };

  return (
      <Dialog open         = {editRoomNameModalOpen}
              onOpenChange = {setEditRoomNameModalOpen}>
        <DialogContent className='bg-sidebar'>
        <DialogHeader>
            <DialogTitle className='sr-only'>
              ルーム名を変更
            </DialogTitle>
            <DialogDescription className='sr-only'>
              ルーム名を変更できます
            </DialogDescription>
          </DialogHeader>

          <Label htmlFor   = 'roomName'
                 className = 'mb-1 block text-sm font-medium'>
            ルーム名を変更
          </Label>
          <Input id       = 'roomName'
                 name     = 'roomName'
                 value    = {editRoomName}
                 onChange = {(e: ChangeEvent<HTMLInputElement>) => setEditRoomName(e.target.value)}
                 required />

          <DialogFooter>
            <Button variant='outline' onClick={() => setEditRoomNameModalOpen(false)}>
              キャンセル
            </Button>
            <Button onClick  = {handleSubmitRoomName}
                    disabled = {isVrmChatRoomSending} >
              {isVrmChatRoomSending ? (<Loader2 className='mr-2 size-4 animate-spin' />) : ('変更')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
};
// RoomNameChangeDialog △