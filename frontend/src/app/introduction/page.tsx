'use client';
import Image from "next/image";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { GoDotFill } from "react-icons/go";


const IntroductionPage = () => {

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="bg-[#f5f5f5] mt-3 h-full w-full">

            <div className="relative ">
                <Image
                    width={1000}
                    height={1000}
                    alt="Baner"
                    src={"/assets/images/introduction/bgintro.jpg"}
                    className="w-full h-[650px] object-cover" />
            </div>

            <div className="absolute top-23 left-0 w-full h-[650px] bg-black/30 pointer-events-none"></div>
            <div className="text-[40px] font-semibold absolute top-38 left-20 z-50 text-white">Chào mừng bạn đến với bot đầu tư chứng khoán</div>

            <div className="text-white left-20 z-50 top-55 absolute w-[600px] leading-8 text-justify">Trong thời đại công nghệ 4.0, việc ứng dụng trí tuệ nhân tạo (AI) và máy học (machine learning) vào đầu tư chứng khoán đã trở nên phổ biến và đem lại nhiều lợi ích đáng kể cho nhà đầu tư. Bot Đầu Tư Chứng Khoán là một công cụ mạnh mẽ giúp bạn tối ưu hóa danh mục đầu tư và gia tăng lợi nhuận với sự hỗ trợ của công nghệ hiện đại nhất, đặc biệt được phát triển trên nền tảng Amibroker.</div>

            <div className="text-[40px] mt-4 font-semibold text-center">Mục tiêu của chúng tôi</div>
            <div className="flex gap-32 mx-20 text-center mt-14">
                <div className="relative w-[250px] h-[180px] bg-white  flex flex-col items-center rounded-2xl">
                    <div>
                        <Image
                            width={500}
                            height={1000}
                            alt="Mục tiêu"
                            src={"/assets/images/introduction/target1.jpg"}
                            className="w-[150px] h-[150px] rounded-2xl absolute -top-10 right-12 
                            transition-transform duration-300 hover:scale-120" />
                    </div>
                    <div className="top-34 absolute">
                        Tiết kiệm thời gian phân tích
                    </div>
                </div>

                <div className="relative w-[250px] h-[180px] bg-white  flex flex-col items-center rounded-2xl">
                    <div>
                        <Image
                            width={500}
                            height={1000}
                            alt="Mục tiêu"
                            src={"/assets/images/introduction/target2.jpg"}
                            className="w-[150px] h-[150px] rounded-2xl absolute -top-10 right-12 
                            transition-transform duration-300 hover:scale-120" />
                    </div>
                    <div className="top-34 absolute">
                        Hạn chế rủi ro cảm tính
                    </div>

                </div>

                <div className="relative w-[250px] h-[180px] bg-white  flex flex-col items-center rounded-2xl">
                    <div>
                        <Image
                            width={500}
                            height={1000}
                            alt="Mục tiêu"
                            src={"/assets/images/introduction/target3.jpg"}
                            className="w-[150px] h-[150px] rounded-2xl absolute -top-10 right-12 
                            transition-transform duration-300 hover:scale-120" />
                    </div>
                    <div className="top-34 absolute">
                        Tối ưu hóa danh mục đầu tư
                    </div>
                </div>

                <div className="relative w-[250px] h-[180px] bg-white  flex flex-col items-center rounded-2xl">
                    <div>
                        <Image
                            width={500}
                            height={1000}
                            alt="Mục tiêu"
                            src={"/assets/images/introduction/target6.jpg"}
                            className="w-[150px] h-[150px] rounded-2xl absolute -top-10 right-12 
                            transition-transform duration-300 hover:scale-120" />
                    </div>
                    <div className="top-32   absolute">
                        Gia tăng lợi nhuận bền vững theo chiến lược khoa học
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="text-[40px] font-semibold text-center">Công nghệ vượt trội</div>
                <div className="flex flex-col gap-10">
                    <div className="flex justify-center items-center gap-60">
                        <Image
                            width={500}
                            height={500}
                            alt="Công nghệ"
                            src={"/assets/images/introduction/tech.jpg"}
                            className="w-[300px] rounded-2xl" />
                        <div className="flex flex-col">
                            <div className="flex items-center font-semibold">
                                <GoDotFill /> AI và Machine Learning
                            </div>
                            <div>
                                Dự đoán xu hướng dựa trên mô hình học dữ liệu lịch sử.
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-60">
                        <Image
                            width={500}
                            height={500}
                            alt="Công nghệ"
                            src={"/assets/images/introduction/tech.jpg"}
                            className="w-[300px] rounded-2xl" />
                        <div className="flex flex-col">
                            <div className="flex items-center font-semibold">
                                <GoDotFill /> Tự động hóa chiến lược đầu tư
                            </div>
                            <div>
                                Bot thực thi lệnh dựa trên tính hiệu đã tính toán sẵn.
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-60">
                        <Image
                            width={500}
                            height={500}
                            alt="Công nghệ"
                            src={"/assets/images/introduction/tech.jpg"}
                            className="w-[300px] rounded-2xl" />
                        <div className="flex flex-col">
                            <div className="flex items-center font-semibold">
                                <GoDotFill /> Phân tích kỹ thuật thông minh
                            </div>
                            <div>
                                Tích hợp hàng trăm chỉ báo phân tích từ Amibroker, liên tục cập nhật và tối ưu.
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-60">
                        <Image
                            width={500}
                            height={500}
                            alt="Công nghệ"
                            src={"/assets/images/introduction/tech.jpg"}
                            className="w-[300px] rounded-2xl" />
                        <div className="flex flex-col">
                            <div className="flex items-center font-semibold">
                                <GoDotFill /> Tùy chỉnh linh hoạt
                                <div>
                                    Nhà đầu tư có thể thiết lập chiến lược riêng phù hợp với phong cách và mục tiêu lợi nhuận.
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default IntroductionPage;