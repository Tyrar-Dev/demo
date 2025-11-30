"use client";

import React, { useState } from "react";
// ⚠️ QUAN TRỌNG: Đảm bảo đường dẫn Sidebar đúng
import Sidebar from "../layouts/sidebar";

import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  ArrowUpRight, ArrowDownLeft, Calendar, Wallet, CheckCircle2, Clock, XCircle, Eye
} from "lucide-react";
import Image from "next/image";

// --- MOCK DATA: Lịch sử giao dịch ---
const TRANSACTIONS = [
  { id: "TRX-10234", user: "Thomas Shelby", email: "tommy@shelby.co.uk", amount: 5000, method: "Bank Transfer", status: "Success", date: "26 Nov 2025, 10:30 AM", avatar: "https://placehold.co/100x100/333/fff?text=TS" },
  { id: "TRX-10235", user: "Arthur Shelby", email: "arthur@shelby.co.uk", amount: 1200, method: "Visa Card", status: "Pending", date: "26 Nov 2025, 09:15 AM", avatar: "https://placehold.co/100x100/555/fff?text=AS" },
  { id: "TRX-10236", user: "Polly Gray", email: "polly@shelby.co.uk", amount: 25000, method: "Crypto (USDT)", status: "Success", date: "25 Nov 2025, 04:45 PM", avatar: "https://placehold.co/100x100/777/fff?text=PG" },
  { id: "TRX-10237", user: "Alfie Solomons", email: "alfie@jewish.com", amount: 350, method: "Paypal", status: "Failed", date: "25 Nov 2025, 02:00 PM", avatar: "https://placehold.co/100x100/999/fff?text=AS" },
  { id: "TRX-10238", user: "Michael Gray", email: "michael@usa.com", amount: 8500, method: "Bank Transfer", status: "Success", date: "24 Nov 2025, 11:20 AM", avatar: "https://placehold.co/100x100/bbb/fff?text=MG" },
  { id: "TRX-10239", user: "Grace Burgess", email: "grace@spy.com", amount: 1000, method: "Visa Card", status: "Success", date: "24 Nov 2025, 09:00 AM", avatar: "https://placehold.co/100x100/ddd/fff?text=GB" },
  { id: "TRX-10240", user: "John Shelby", email: "john@shelby.co.uk", amount: 4500, method: "Crypto (BTC)", status: "Pending", date: "23 Nov 2025, 08:30 PM", avatar: "https://placehold.co/100x100/444/fff?text=JS" },
];

const TransactionHistory = () => {
  // Key 'exceptions' ứng với "Lịch sử chuyển tiền" trong Sidebar của bạn
  const [activeTab, setActiveTab] = useState("exceptions");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Logic lọc và phân trang
  const filteredData = TRANSACTIONS.filter(item =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Tính toán nhanh cho Stats Cards
  const totalReceived = TRANSACTIONS.reduce((acc, curr) => curr.status === 'Success' ? acc + curr.amount : acc, 0);
  const totalPending = TRANSACTIONS.filter(t => t.status === 'Pending').length;

  return (
    <div className="flex min-h-screen font-sans text-gray-800">


      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 transition-all duration-300">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử giao dịch</h1>
            <p className="text-sm text-gray-500 mt-1">Theo dõi toàn bộ dòng tiền nạp vào hệ thống.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition shadow-sm">
            <Download size={16} />
            Xuất Báo Cáo
          </button>
        </div>

        {/* Stats Cards - Thống kê nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Tổng tiền đã nhận</p>
              <h3 className="text-2xl font-bold text-gray-900">${totalReceived.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <ArrowDownLeft size={24} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Giao dịch chờ duyệt</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalPending}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <Clock size={24} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Phương thức phổ biến</p>
              <h3 className="text-lg font-bold text-gray-900">Bank Transfer</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Wallet size={24} />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo Mã GD hoặc User..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex items-center">
              <Calendar size={16} className="absolute left-3 text-gray-500" />
              <input type="date" className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none hover:bg-gray-50 cursor-pointer" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              <Filter size={16} />
              Lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Mã Giao Dịch</th>
                  <th className="px-6 py-4">Người Gửi</th>
                  <th className="px-6 py-4">Số Tiền</th>
                  <th className="px-6 py-4">Phương Thức</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4">Thời Gian</th>
                  <th className="px-6 py-4 text-center">Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentData.length > 0 ? currentData.map((trx) => (
                  <tr key={trx.id} className="hover:bg-blue-50/30 transition duration-150 group">
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-gray-700">#{trx.id}</span>
                    </td>

                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          width={32} height={32}
                          src={trx.avatar}
                          alt={trx.user}
                          className="rounded-full object-cover border border-gray-100"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{trx.user}</p>
                          <p className="text-xs text-gray-500">{trx.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-emerald-600">
                        + ${trx.amount.toLocaleString()}
                      </span>
                    </td>

                    {/* Method */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trx.method}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <TransactionStatusBadge status={trx.status} />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {trx.date}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Không tìm thấy giao dịch nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
            <span className="text-xs text-gray-500">
              Đang xem <span className="font-bold text-gray-800">{currentData.length}</span> giao dịch
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-gray-700 px-2">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
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

// --- Component Badge cho Trạng thái Giao dịch ---
const TransactionStatusBadge = ({ status }: { status: string }) => {
  let styles = "";
  let Icon = CheckCircle2;

  switch (status) {
    case "Success":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
      Icon = CheckCircle2;
      break;
    case "Pending":
      styles = "bg-amber-50 text-amber-700 border-amber-200";
      Icon = Clock;
      break;
    case "Failed":
      styles = "bg-rose-50 text-rose-700 border-rose-200";
      Icon = XCircle;
      break;
    default:
      styles = "bg-gray-50 text-gray-600 border-gray-200";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles}`}>
      <Icon size={12} />
      {status === "Success" ? "Thành công" : status === "Pending" ? "Đang xử lý" : "Thất bại"}
    </span>
  );
}

export default TransactionHistory;