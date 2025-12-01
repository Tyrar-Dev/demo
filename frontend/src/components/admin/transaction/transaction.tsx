"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../layouts/sidebar";
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  ArrowUpRight, ArrowDownLeft, Calendar, Wallet, CheckCircle2, Clock, XCircle, Eye
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addHours, format } from "date-fns";

const TransactionHistory = () => {

  const [activeTab, setActiveTab] = useState<string>("exceptions");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 1;


  const [accessToken, setAccessToken] = useState<string>('');
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [transactions, setTransactions] = useState<any[]>([]);

  // state tính tổng tiền toàn bộ
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);


  const [openShowTransaction, setOpenShowTransaction] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>("");


  useEffect(() => {
    if (!userInfo?.Id) return;
    loadToken();
    if (accessToken) {
      getTransaction();
    }
  }, [userInfo, accessToken, currentPage, transactions]);

  const loadToken = async () => {
    const token = await GetAccessToken(userInfo?.Id);
    if (token) setAccessToken(token);
  };

  const getTransaction = async () => {
    if (!accessToken) return;

    try {

      const allRes = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_API}WalletTransaction/GetAllTransactionsAdmin?pageSize=10000&pageNumber=1`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const allData = allRes.data?.data?.items || [];
      setAllTransactions(allData);

      const pageRes = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_API}WalletTransaction/GetAllTransactionsAdmin?pageSize=${itemsPerPage}&pageNumber=${currentPage}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const totalItems = pageRes.data?.data?.totalItems || 0;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));

      const pageData = pageRes.data?.data?.items || [];

      const transactionsWithUser = await Promise.all(
        pageData.map(async (x: any) => {
          try {
            const userRes = await axios.get(
              `${process.env.NEXT_PUBLIC_URL_API}Authen/GetUserById?userId=${x.userId}`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            const u = userRes.data?.data;
            return {
              id: x.id,
              userId: x.userId,
              fullName: u?.fullName || "Không rõ",
              email: u?.email || "",
              avatar: u?.urlAvatar || "",
              amount: x.amount,
              method: x.transactionType,
              status:
                x.transactionStatus.toLowerCase() === "thành công"
                  ? "Success"
                  : x.transactionStatus.toLowerCase() === "đang xử lý"
                    ? "Pending"
                    : x.transactionStatus.toLowerCase() === "thất bại"
                      ? "Failed"
                      : x.transactionStatus,
              orderCode: x.orderCode,
              date: x.timestamp,

            };
          } catch (e) {
            return {
              id: x.id,
              userId: x.userId,
              fullName: "Không tìm thấy",
              email: "",
              avatar: "",
              amount: x.amount,
              method: x.transactionType,
              status: x.transactionStatus,
              orderCode: x.orderCode,
              date: x.timestamp,
            };
          }
        })
      );

      setTransactions(transactionsWithUser);

    } catch (err) {
      console.log(err);
    }
  };




  const filteredData = transactions.filter(item =>
    String(item.orderCode ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.fullName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.email ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );



  const currentData = filteredData;


  // Stats
  const totalReceived = allTransactions.reduce(
    (acc, curr) => curr.transactionStatus.toLowerCase() === 'thành công' ? acc + curr.amount : acc,
    0
  );

  const totalPending = allTransactions.filter(t => t.transactionStatus.toLowerCase() === 'đang xử lý').length;
  const getPageNumbers = (current: number, total: number) => {
    const pages: (number | string)[] = [];

    if (total <= 3) {
      // Nếu tổng số trang <= 3 thì hiển thị hết
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      // Luôn hiển thị trang đầu
      pages.push(1);

      // Nếu current cách trang đầu > 2 thì thêm "..."
      if (current > 3) pages.push("...");

      // Các trang giữa
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      // Nếu current cách trang cuối > 2 thì thêm "..."
      if (current < total - 2) pages.push("...");

      // Luôn hiển thị trang cuối
      pages.push(total);
    }

    return pages;
  };




  return (
    <div className="flex min-h-screen font-sans text-gray-800">

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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Tổng tiền đã nhận</p>
              <h3 className="text-2xl font-bold text-gray-900">₫{totalReceived.toLocaleString()}</h3>
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
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex items-center">
              <Calendar size={16} className="absolute left-3 text-gray-500" />
              <input type="date" className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              <Filter size={16} />
              Lọc
            </button>
          </div>
        </div>

        {/* TABLE */}
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
                {currentData.length > 0 ? (
                  currentData.map((trx) => (
                    <tr key={trx.id} className="hover:bg-blue-50/30 transition duration-150">
                      <td className="px-6 py-4 font-mono text-sm font-medium text-gray-700">{trx.orderCode}</td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* <Image width={32} height={32} src={trx.avatar} alt="" className="rounded-full object-cover border" /> */}
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{trx.fullName}</p>
                            <p className="text-xs text-gray-500">{trx.email}</p>

                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-emerald-600">
                          + ₫{trx.amount.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">{trx.method}</td>

                      <td className="px-6 py-4">
                        <TransactionStatusBadge status={trx.status} />
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trx.date ? (
                          isNaN(new Date(trx.date).getTime()) ? (
                            "--:--"
                          ) : (
                            format(addHours(new Date(trx.date), 7), "EEE, dd-MM-yyyy HH:mm")
                          )
                        ) : (
                          "--:--"
                        )}
                      </td>


                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedTransaction(trx);
                            setOpenShowTransaction(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye size={18} />
                        </button>
                        {openShowTransaction && selectedTransaction && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
                              {/* Close button */}
                              <button
                                onClick={() => setOpenShowTransaction(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
                              >
                                ✕
                              </button>

                              <h2 className="text-lg font-bold mb-6">Chi Tiết Giao Dịch</h2>

                              {/* Thông tin user */}
                              <div className="flex items-center gap-4 mb-4">
                                {selectedTransaction.avatar ? (
                                  <img
                                    src={selectedTransaction.avatar}
                                    alt={selectedTransaction.fullName}
                                    className="w-12 h-12 rounded-full border object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full border bg-gray-100 flex items-center justify-center text-gray-400">
                                    👤
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900">{selectedTransaction.fullName}</p>
                                  <p className="text-sm text-gray-500">{selectedTransaction.email}</p>
                                </div>
                              </div>

                              {/* Thông tin giao dịch */}
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-500">Mã GD:</span>
                                  <span className="text-gray-900">{selectedTransaction.orderCode}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-500">Số tiền:</span>
                                  <span className="font-bold text-emerald-600">
                                    + ₫{selectedTransaction.amount.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-500">Phương thức:</span>
                                  <span className="text-gray-900">{selectedTransaction.method}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-500">Trạng thái:</span>
                                  <TransactionStatusBadge status={selectedTransaction.status} />
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-500">Thời gian:</span>
                                  <span className="text-gray-900">
                                    {selectedTransaction.date
                                      ? format(addHours(new Date(selectedTransaction.date), 7), "EEE, dd-MM-yyyy HH:mm")
                                      : "--:--"}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-6 text-right">
                                <button
                                  onClick={() => setOpenShowTransaction(false)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                  Đóng
                                </button>
                              </div>
                            </div>
                          </div>
                        )}


                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Không có giao dịch nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 m-2">
            {/* Back */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Số trang */}
            {getPageNumbers(currentPage, totalPages).map((page, idx) =>
              page === "..." ? (
                <span key={idx} className="w-8 h-8 flex items-center justify-center text-gray-500 text-xs">...</span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition 
          ${currentPage === page
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>


        </div>
      </main>
    </div>
  );
};


const TransactionStatusBadge = ({ status }: { status: string }) => {
  let styles = "";
  let Icon = CheckCircle2;


  const normalized =
    status.toLowerCase() === "thành công" ? "Success" :
      status.toLowerCase() === "đang xử lý" ? "Pending" :
        status.toLowerCase() === "thất bại" ? "Failed" :
          status;

  switch (normalized) {
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
    <span
      className={`inline-flex items-center gap-1 px-1 py-1 rounded-full text-xs font-semibold border ${styles}`}
    >
      <Icon size={14} />
      <span className="leading-none">{normalized === "Success" ? "Thành công" : normalized === "Pending" ? "Đang xử lý" : "Thất bại"}</span>
    </span>

  );
};

export default TransactionHistory;
