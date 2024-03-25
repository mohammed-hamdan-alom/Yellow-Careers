import { Modal } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

export const showDeleteConfirm = ({ onOk, onCancel}) => {
  confirm({
    title: "Are you sure you want to delete?",
    icon: <ExclamationCircleFilled />,
    content: "Some descriptions",
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk: onOk,
    onCancel: onCancel,
  });
};