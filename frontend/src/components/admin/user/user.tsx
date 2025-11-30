"use client";

import React, { useEffect, useState } from "react";
// ⚠️ QUAN TRỌNG: Đảm bảo đường dẫn Sidebar đúng với project của bạn
import Sidebar from "../layouts/sidebar";

import {
  Search, Filter, Plus, Trash2, Edit, MoreHorizontal,
  Download, ChevronLeft, ChevronRight, Mail, Phone, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import { MdOutlineClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState("policies");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [accessToken, setAccessToken] = useState<string>('');
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [listUser, setListUser] = useState<any>([]);
  const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);

  useEffect(() => {
    if (!userInfo?.Id && !accessToken) return;
    loadData();
    if (accessToken) {
      getListUser();
    }
  }, [userInfo, accessToken]);

  const loadData = async () => {
    const token = await GetAccessToken(userInfo?.Id);
    if (token) setAccessToken(token);
  };


  // const filteredUsers = listUser?.filter((user: any) =>
  //   user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   user.phone.includes(searchTerm)
  // );

  const getListUser = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Authen/GetListUser?pageSize=5&pageNumber=1`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(res => {
      setListUser(res.data.data.items);
    }).catch(err => {
      console.log(err);
    })
  }

  const handleDeleteUser = async (userId: string) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}Authen/DeleteUser?userId=${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    ).then(res => {
      toast.success("Xóa người dùng thành công");
      setOpenDeleteUser(false);
      getListUser();
    }).catch(err => {
      console.log(err);
    })
  }

  const totalPages = Math.ceil(listUser.length / itemsPerPage);
  const currentUsers = listUser.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="flex-1 p-8 transition-all duration-300">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Danh sách người dùng</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản, thông tin liên hệ và phân quyền.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
              <Download size={16} />
              Xuất Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5">
              <Plus size={16} />
              Thêm mới
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, sđt..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50">
              <option>Tất cả quyền</option>
              <option>Admin</option>
              <option>User</option>
            </select>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Thành viên</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentUsers.length > 0 ? currentUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition duration-150 group">
                    {/* Cột Tên & Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          width={40} height={40}
                          src={user.urlAvatar}
                          alt={user.fullName}
                          className="rounded-full object-cover border border-gray-100"
                        />
                        <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                      </div>
                    </td>

                    {/* Cột Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {user.email}
                      </div>
                    </td>

                    {/* Cột Số điện thoại */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        {user.phoneNumber}
                      </div>
                    </td>

                    {/* Cột Vai trò */}
                    <td className="px-6 py-4">
                      <RoleBadge role={user.roleName} />
                    </td>

                    {/* Cột Trạng thái */}
                    <td className={`px-6 py-4`}>
                      <StatusBadge status={user.isActive ? "Đã kích hoạt" : "Chưa kích hoạt"} />
                    </td>

                    {/* Cột Hành động */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Chỉnh sửa">
                          <Edit size={16} />
                        </button>
                        <div onClick={() => setOpenDeleteUser(true)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" title="Xóa">
                          <Trash2 size={16} />
                        </div>
                        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                      <AnimatePresence>
                        {openDeleteUser && (
                          <>
                            <motion.div
                              className="fixed inset-0 bg-black bg-opacity-50 z-70"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.5 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setOpenDeleteUser(false)}
                            />

                            <motion.div
                              className="fixed inset-0 z-70 flex items-center justify-center"
                              initial={{ y: "100%", opacity: 0 }}
                              animate={{ y: "0%", opacity: 1 }}
                              exit={{ y: "100%", opacity: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <div className="bg-white text-black rounded-xl shadow-xl p-6 w-full max-w-md text-left">
                                <h2 className="text-lg font-semibold mb-4">Xác nhận xóa người dùng<br /> {user.fullName}</h2>
                                <p className="mb-6">Bạn có chắc chắn muốn xóa người dùng này?</p>
                                <div className="flex justify-end gap-3">
                                  <button
                                    className="px-4 py-2 rounded-md border border-blue-400 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Xóa
                                  </button>
                                  <button
                                    className="px-4 py-2 rounded-md bg-blue-400 hover:bg-blue-500 text-white cursor-pointer transition-all duration-200"
                                    onClick={() => setOpenDeleteUser(false)}
                                  >
                                    Không
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                      Không tìm thấy kết quả nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
            <span className="text-xs text-gray-500">
              Hiển thị <span className="font-bold text-gray-800">{currentUsers.length}</span> trên tổng số <span className="font-bold text-gray-800">{listUser.length}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition ${currentPage === page
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    "Đã kích hoạt": { color: "text-green-700 bg-green-50 border-green-200", icon: FaCheck },
    "Chưa kích hoạt": { color: "text-red-700 bg-red-50 border-red-200", icon: MdOutlineClose },
  };
  const style = config[status] || config.Inactive;
  const Icon = style.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.color}`}>
      <Icon size={12} /> {status}
    </span>
  );
}

const RoleBadge = ({ role }: { role: string }) => {
  const color = role === 'Admin' ? 'text-purple-700 bg-purple-50 border-purple-200'
    : role === 'Moderator' ? 'text-blue-700 bg-blue-50 border-blue-200'
      : 'text-gray-600 bg-gray-50 border-gray-200';
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${color}`}>
      {role}
    </span>
  );
}

export default UserManagementPage;