import { useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function HomePage() {
    const aboutRef = useRef(null);
    const projectsRef = useRef(null);
    const teamRef = useRef(null);
    const contactRef = useRef(null);
    const navigate = useNavigate();

    const scrollToSection = (elementRef) => {
        elementRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSignInClick = () => {
        navigate('/login');
    };

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % articleData.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const articleData = [
        {
            title: "Ứng dụng AI trong nông nghiệp",
            image: "https://media.istockphoto.com/id/1320570592/photo/maize-seedling-in-cultivated-agricultural-field-with-graphic-concepts-modern-agricultural.jpg?s=612x612&w=0&k=20&c=hNCJUuhPnVSCyK0se9abAsaBJiW2GwSXKLEJKwoZ9UU=",
            link: "https://link-bai-bao-1.com",
            content: `Trí tuệ nhân tạo (AI) đang mở ra kỷ nguyên mới trong nông nghiệp thông minh, đặc biệt là trong việc tối ưu hóa điều kiện canh tác cho cây thanh long. Nghiên cứu của chúng tôi tập trung vào việc phát triển hệ thống máy học có khả năng phân tích dữ liệu từ các cảm biến để xác định chính xác nhu cầu ánh sáng của cây theo từng giai đoạn phát triển.

Sử dụng các thuật toán học sâu, chúng tôi đã xây dựng mô hình có khả năng dự đoán chu kỳ ánh sáng tối ưu cho từng giai đoạn phát triển của cây. Mô hình này được huấn luyện từ dữ liệu thu thập trong 12 tháng, với hơn 30.000 điểm dữ liệu về cường độ ánh sáng, thời gian chiếu sáng, nhiệt độ, độ ẩm và các chỉ số sinh trưởng của cây.

Kết quả ban đầu cho thấy hệ thống AI của chúng tôi có thể giúp tăng năng suất cây trồng lên đến 27% và giảm tiêu thụ năng lượng cho hệ thống đèn LED khoảng 32% so với phương pháp chiếu sáng truyền thống. Đặc biệt, mô hình có khả năng thích ứng với các điều kiện thời tiết khác nhau, điều chỉnh thời gian và cường độ ánh sáng một cách tự động.

Nghiên cứu của chúng tôi mở ra hướng đi mới cho nông nghiệp công nghệ cao, đồng thời góp phần vào mục tiêu phát triển bền vững bằng cách tối ưu hóa sử dụng năng lượng và tài nguyên trong canh tác nông nghiệp.`,
            keywords: ["AI", "Máy học", "Nông nghiệp thông minh", "Tối ưu hóa năng lượng", "Thanh long"]
        },
        {
            title: "Tối ưu hóa năng lượng với Raspberry Pi",
            image: "https://sixfab.com/wp-content/uploads/2022/07/WhatsApp-Image-2022-07-03-at-11.11.49-PM.jpeg",
            link: "https://link-bai-bao-2.com",
            content: `Raspberry Pi ngày càng chứng tỏ vai trò quan trọng trong các hệ thống nông nghiệp thông minh. Trong nghiên cứu này, chúng tôi trình bày cách thiết kế và triển khai một hệ thống điều khiển ánh sáng thông minh cho cây thanh long dựa trên nền tảng Raspberry Pi, với mục tiêu tối ưu hóa năng lượng tiêu thụ.

Hệ thống của chúng tôi sử dụng Raspberry Pi 4 làm đơn vị xử lý trung tâm, kết nối với mạng cảm biến không dây thu thập dữ liệu về ánh sáng, nhiệt độ và độ ẩm trong khu vực canh tác. Phần mềm được phát triển trên Python với các thư viện mã nguồn mở cho phép xử lý dữ liệu theo thời gian thực và đưa ra quyết định điều khiển các đèn LED.

Thử nghiệm trong 6 tháng cho thấy hệ thống có thể tiết kiệm đến 35% năng lượng so với cách tiếp cận truyền thống, đồng thời duy trì hoặc cải thiện năng suất cây trồng. Đặc biệt, khả năng điều chỉnh cường độ ánh sáng theo thời gian thực dựa trên điều kiện môi trường và giai đoạn phát triển của cây đã chứng minh hiệu quả trong việc tối ưu quá trình quang hợp.

Hệ thống còn được tích hợp giao diện web cho phép người dùng theo dõi và điều chỉnh thông số từ xa, cũng như lưu trữ dữ liệu lịch sử để phân tích xu hướng dài hạn. Chi phí triển khai thấp và khả năng mở rộng linh hoạt làm cho giải pháp này trở nên khả thi cho cả trang trại quy mô nhỏ lẫn lớn.`,
            keywords: ["Raspberry Pi", "IoT", "Tiết kiệm năng lượng", "Điều khiển LED", "Canh tác thông minh"]
        },
        {
            title: "Cảm biến ánh sáng trong nông nghiệp",
            image: "https://www.aaaksc.com/wp-content/uploads/2021/09/Light-sensors-3.jpg",
            link: "https://link-bai-bao-3.com",
            content: `Cảm biến ánh sáng đóng vai trò then chốt trong các hệ thống canh tác thông minh hiện đại. Nghiên cứu của chúng tôi tập trung vào việc phát triển và ứng dụng hệ thống cảm biến ánh sáng đa phổ để tối ưu hóa điều kiện chiếu sáng cho cây thanh long.

Chúng tôi đã thiết kế một mạng lưới cảm biến bao gồm các cảm biến đo cường độ ánh sáng (LDR), cảm biến ánh sáng đa phổ (AS7341) và cảm biến UV (VEML6075). Mạng lưới này được kết nối với bộ vi điều khiển Arduino tạo thành các nút (nodes) thu thập dữ liệu, sau đó truyền về trung tâm xử lý qua giao thức không dây ZigBee để đảm bảo hiệu suất năng lượng cao và phạm vi kết nối rộng.

Hệ thống cảm biến cho phép đo lường chính xác quang phổ mà cây tiếp nhận, bao gồm ánh sáng khả kiến, hồng ngoại và tia UV. Dữ liệu này được sử dụng để điều chỉnh hệ thống đèn LED, tối ưu hóa bước sóng ánh sáng cung cấp cho cây theo từng giai đoạn sinh trưởng.

Kết quả nghiên cứu cho thấy khả năng phân biệt các dải quang phổ giúp tăng hiệu quả quang hợp lên 23% và cải thiện chất lượng quả thanh long với hàm lượng đường cao hơn 15% so với phương pháp chiếu sáng truyền thống. Hệ thống cảm biến cũng có tính bền vững cao, với độ tin cậy >99% trong điều kiện nông nghiệp thực tế và tuổi thọ pin lên đến 6 tháng cho các nút cảm biến không dây.

Nghiên cứu này chứng minh tiềm năng của công nghệ cảm biến hiện đại trong việc nâng cao hiệu quả canh tác và tiết kiệm tài nguyên, đồng thời cung cấp nền tảng cho các giải pháp nông nghiệp thông minh trong tương lai.`,
            keywords: ["Cảm biến ánh sáng", "Cảm biến quang phổ", "Arduino", "ZigBee", "Quang hợp", "Nông nghiệp chính xác"]
        },
    ];

    // Thêm toggle cho nav mobile
    const [navOpen, setNavOpen] = useState(false);

    return (
        <div className="min-h-screen relative">
            <video
                className="fixed top-0 left-0 w-full h-full object-cover z-0"
                src="/iot_bg.mp4"
                autoPlay
                loop
                muted
            />

            <div className="relative z-10">
                {/* Navigation Bar - Cải thiện với hiệu ứng hover */}
                <nav className={`w-full py-4 px-4 md:px-6 fixed top-0 z-20 shadow-md backdrop-blur transition-all duration-300 
                    ${isScrolled ? 'bg-white text-black' : 'bg-black/60 text-white'}`}>
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center">
                            <span className={`ml-2 md:ml-3 text-lg md:text-xl font-bold transition-colors duration-300 
                                ${isScrolled ? 'text-black' : 'text-white'}`}>
                                Light Optimization
                            </span>
                        </div>
                        {/* Nút nav mobile */}
                        <div className="md:hidden">
                            <button onClick={() => setNavOpen(!navOpen)}>
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={navOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
                                </svg>
                            </button>
                        </div>
                        {/* Nav menu */}
                        <div className={`flex-col md:flex md:flex-row md:items-center md:static absolute top-full left-0 w-full md:w-auto transition-all duration-300 bg-white md:bg-transparent text-black md:text-inherit shadow md:shadow-none 
                            ${navOpen ? "flex" : "hidden"} md:flex`}>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 mr-0 md:mr-8 px-4 md:px-0 py-4 md:py-0">
                                <a href="#about" 
                                   onClick={(e) => { e.preventDefault(); scrollToSection(aboutRef); setNavOpen(false); }} 
                                   className="relative group overflow-hidden py-1">
                                    <span className="relative z-10 font-medium transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">About Us</span>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                                <a href="#projects" 
                                   onClick={(e) => { e.preventDefault(); scrollToSection(projectsRef); setNavOpen(false); }} 
                                   className="relative group overflow-hidden py-1">
                                    <span className="relative z-10 font-medium transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">Our Projects</span>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                                <a href="#team" 
                                   onClick={(e) => { e.preventDefault(); scrollToSection(teamRef); setNavOpen(false); }} 
                                   className="relative group overflow-hidden py-1">
                                    <span className="relative z-10 font-medium transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">Team</span>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                                <a href="#contact" 
                                   onClick={(e) => { e.preventDefault(); scrollToSection(contactRef); setNavOpen(false); }} 
                                   className="relative group overflow-hidden py-1">
                                    <span className="relative z-10 font-medium transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">Contact Us</span>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            </div>
                            <button
                                onClick={() => { handleSignInClick(); setNavOpen(false); }}
                                className={`mt-2 md:mt-0 border rounded-full px-6 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 relative overflow-hidden group
                                    ${isScrolled 
                                        ? 'text-black border-black hover:text-white focus:ring-black' 
                                        : 'text-white md:text-white border-white md:border-white hover:text-black focus:ring-white md:ml-0 ml-4'}`}
                            >
                                <span className={`absolute inset-0 ${isScrolled ? 'bg-black' : 'bg-white'} w-0 transition-all duration-300 ease-out group-hover:w-full`}></span>
                                <span className="relative z-10">Log In</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="h-[60vh] sm:h-screen flex flex-col items-center justify-center pt-24 sm:pt-16 px-4 text-center">
                    <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg mb-6">
                        Optimizing Light for Dragon Fruit Growth
                    </h1>
                    <p className="text-white text-lg sm:text-xl max-w-3xl mx-auto mb-8 drop-shadow-md">
                        Advanced AI and embedded systems for smart agricultural lighting solutions
                    </p>
                    <button
                        onClick={() => scrollToSection(aboutRef)}
                        className="relative overflow-hidden bg-white text-black px-8 py-3 rounded-md font-medium shadow-lg group"
                    >
                        <span className="absolute inset-0 w-0 bg-blue-600 transition-all duration-500 ease-out group-hover:w-full"></span>
                        <span className="relative flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-white">
                            Learn More
                            <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </span>
                    </button>
                </div>

                {/* About Us Section */}
                <section ref={aboutRef} id="about" className="bg-white py-16 md:py-24">
                    <div className="px-4 md:px-16">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-10 md:mb-16">
                                <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif mb-4 relative inline-block">
                                    About Us
                                    <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-600"></span>
                                </h2>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">
                                    Sáng tạo giải pháp thông minh cho nông nghiệp hiện đại
                                </p>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:h-full gap-8 md:gap-12 items-center">
                                {/* Left side - Image with overlay box */}
                                <div className="md:w-1/2 w-full relative" data-aos="fade-right">
                                    <div className="relative h-72 md:h-[450px] rounded-lg shadow-xl overflow-hidden">
                                        <img
                                            src="/about us.jpg"
                                            alt="Dragon fruit plants with lighting optimization"
                                            className="w-full h-full object-cover rounded-lg transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 p-6 text-white">
                                            <span className="bg-blue-600 text-white text-sm py-1 px-3 rounded-full mb-3 inline-block font-medium">
                                                UIT Technology Project
                                            </span>
                                            <h3 className="text-xl md:text-2xl font-semibold mb-4">
                                                Tối ưu hóa ánh sáng cho cây thanh long
                                            </h3>
                                            
                                            {/* Công nghệ sử dụng - with more relevant icons */}
                                            <div className="bg-black/40 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                                                <div className="font-medium text-sm mb-2">Công nghệ sử dụng</div>
                                                <div className="text-sm space-y-1.5">
                                                    {/* Arduino & Sensors - Biểu tượng bo mạch với các chân kết nối */}
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <rect x="3" y="6" width="18" height="12" rx="1" />
                                                                <circle cx="7" cy="10" r="1" />
                                                                <circle cx="7" cy="14" r="1" />
                                                                <circle cx="12" cy="10" r="1" />
                                                                <circle cx="12" cy="14" r="1" />
                                                                <circle cx="17" cy="10" r="1" />
                                                                <circle cx="17" cy="14" r="1" />
                                                                <line x1="7" y1="3" x2="7" y2="6" />
                                                                <line x1="12" y1="3" x2="12" y2="6" />
                                                                <line x1="17" y1="3" x2="17" y2="6" />
                                                                <line x1="7" y1="18" x2="7" y2="21" />
                                                                <line x1="12" y1="18" x2="12" y2="21" />
                                                                <line x1="17" y1="18" x2="17" y2="21" />
                                                            </svg>
                                                        </div>
                                                        <span>Arduino & Sensors</span>
                                                    </div>
                                                    
                                                    {/* Raspberry Pi - Biểu tượng bo mạch nhỏ gọn */}
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <rect x="3" y="4" width="18" height="16" rx="1" />
                                                                <circle cx="8" cy="8" r="1.5" />
                                                                <circle cx="16" cy="8" r="1.5" />
                                                                <rect x="6" y="13" width="12" height="4" rx="0.5" />
                                                                <line x="4" y="10" x2="6" y2="10" />
                                                                <line x="18" y="10" x2="20" y2="10" />
                                                                <line x="8" y="6" x2="8" y2="4" />
                                                                <line x="16" y="6" x2="16" y2="4" />
                                                            </svg>
                                                        </div>
                                                        <span>Raspberry Pi</span>
                                                    </div>
                                                    
                                                    {/* Machine Learning - Biểu tượng network neural */}
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <circle cx="5" cy="7" r="2" />
                                                                <circle cx="5" cy="17" r="2" />
                                                                <circle cx="19" cy="7" r="2" />
                                                                <circle cx="19" cy="17" r="2" />
                                                                <circle cx="12" cy="12" r="2" />
                                                                <line x1="5" y1="9" x2="12" y2="12" />
                                                                <line x1="12" y1="12" x2="19" y2="9" />
                                                                <line x1="5" y1="15" x2="12" y2="12" />
                                                                <line x1="12" y1="12" x2="19" y2="15" />
                                                            </svg>
                                                        </div>
                                                        <span>Machine Learning</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right side - Text content with icons */}
                                <div className="md:w-1/2 w-full md:pl-12 flex flex-col justify-center mt-12 md:mt-0" data-aos="fade-left">
                                    <div className="space-y-6 md:space-y-8 text-base sm:text-lg leading-relaxed">
                                        <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-blue-600 shadow-sm">
                                            <h3 className="flex items-center text-xl font-semibold mb-2 text-gray-800">
                                                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                                </svg>
                                                Dự án của chúng tôi
                                            </h3>
                                            <p className="text-gray-700">
                                                Chúng tôi là nhóm gồm 4 sinh viên UIT thực hiện đồ án chuyên ngành với đề tài "Tối ưu hóa ánh sáng cho cây thanh long bằng thiết bị nhúng và trí tuệ nhân tạo". Dự án kết hợp giữa cảm biến Arduino, bộ xử lý Raspberry Pi và mô hình AI để theo dõi, điều chỉnh và dự đoán nhu cầu ánh sáng phù hợp với từng giai đoạn phát triển của cây.
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <h3 className="flex items-center text-xl font-semibold mb-3 text-gray-800">
                                                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                Tầm nhìn & Mục tiêu
                                            </h3>
                                            <p className="text-gray-700">
                                                Với tinh thần sáng tạo và niềm đam mê với công nghệ nông nghiệp, nhóm mong muốn đóng góp một giải pháp hiệu quả và bền vững cho lĩnh vực canh tác thông minh, giúp nông dân tối ưu năng suất và tiết kiệm năng lượng.
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            {/* Giám sát card with eye animation */}
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:border-blue-300 hover:shadow-md group">
                                                <div className="flex items-center mb-2">
                                                    <div className="bg-blue-100 p-2 rounded-full mr-2 overflow-hidden relative group-hover:bg-blue-200 transition-all duration-300">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth="2" 
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                className="group-hover:animate-pulse"
                                                            ></path>
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth="2" 
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                className="group-hover:animate-[scan_2s_ease-in-out_infinite]"
                                                            ></path>
                                                        </svg>
                                                        {/* Radar wave effect */}
                                                        <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-blue-300/30 group-hover:scale-150 group-hover:opacity-0 transition-all duration-1000"></div>
                                                    </div>
                                                    <div className="text-blue-600 font-semibold">Giám sát</div>
                                                </div>
                                                <p className="text-sm text-gray-700">Theo dõi liên tục các thông số ánh sáng, nhiệt độ và độ ẩm</p>
                                            </div>
                                            
                                            {/* Phân tích card with chart animation */}
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:border-blue-300 hover:shadow-md group">
                                                <div className="flex items-center mb-2">
                                                    <div className="bg-blue-100 p-2 rounded-full mr-2 group-hover:bg-blue-200 transition-all duration-300">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth="2"
                                                                className="group-hover:animate-bounce origin-bottom"
                                                                style={{animationDuration: "1.2s"}}
                                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"
                                                            ></path>
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth="2"
                                                                className="group-hover:animate-bounce origin-bottom" 
                                                                style={{animationDuration: "0.8s", animationDelay: "0.2s"}}
                                                                d="M9 19V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2"
                                                            ></path>
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth="2"
                                                                className="group-hover:animate-bounce origin-bottom"
                                                                style={{animationDuration: "1s", animationDelay: "0.4s"}} 
                                                                d="M15 19V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                    <div className="text-blue-600 font-semibold">Phân tích</div>
                                                </div>
                                                <p className="text-sm text-gray-700">Xử lý dữ liệu và đưa ra các dự đoán về nhu cầu ánh sáng</p>
                                            </div>
                                            
                                            {/* Tối ưu hoá card with lightning animation */}
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:border-blue-300 hover:shadow-md group">
                                                <div className="flex items-center mb-2">
                                                    <div className="bg-blue-100 p-2 rounded-full mr-2 overflow-hidden relative group-hover:bg-blue-200 transition-all duration-300">
                                                        <svg className="w-5 h-5 text-blue-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth="2" 
                                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                                                className="group-hover:text-yellow-500 transition-colors duration-300 group-hover:animate-pulse"
                                                            ></path>
                                                        </svg>
                                                        {/* Lightning flash effect */}
                                                        <div className="absolute inset-0 bg-yellow-300/0 group-hover:bg-yellow-300/30 group-hover:animate-[flash_1.5s_ease-out_infinite] rounded-full"></div>
                                                    </div>
                                                    <div className="text-blue-600 font-semibold">Tối ưu hoá</div>
                                                </div>
                                                <p className="text-sm text-gray-700">Điều chỉnh ánh sáng tự động theo từng giai đoạn phát triển</p>
                                            </div>
                                            
                                            {/* Tiết kiệm card with money animation */}
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:border-blue-300 hover:shadow-md group">
                                                <div className="flex items-center mb-2">
                                                    <div className="bg-blue-100 p-2 rounded-full mr-2 group-hover:bg-blue-200 transition-all duration-300 overflow-hidden relative">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <circle 
                                                                cx="12" 
                                                                cy="12" 
                                                                r="8"
                                                                className="group-hover:animate-[spin_3s_linear_infinite]"
                                                            />
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth="2" 
                                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                className="group-hover:text-green-500 transition-colors duration-300"
                                                            ></path>
                                                        </svg>
                                                        {/* Coins falling effect */}
                                                        <div className="absolute -bottom-8 left-2 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[fallCoin_1.5s_ease-in_infinite]"></div>
                                                        <div className="absolute -bottom-8 left-4 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[fallCoin_1.3s_ease-in_infinite_.2s]"></div>
                                                    </div>
                                                    <div className="text-blue-600 font-semibold">Tiết kiệm</div>
                                                </div>
                                                <p className="text-sm text-gray-700">Giảm thiểu năng lượng tiêu thụ và tăng năng suất cây trồng</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Projects Section - Enhanced Professional Version */}
                <section ref={projectsRef} id="projects" className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 md:py-24">
                    <div className="px-4 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center mb-8 md:mb-12">
                            <span className="text-blue-600 font-medium tracking-wider text-sm uppercase">Nghiên cứu & Ứng dụng</span>
                            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif mt-2 mb-4">Our Projects</h2>
                            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            {/* Left - Project Description */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
                                    <h3 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
                                        <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Tối ưu hóa ánh sáng nông nghiệp
                                    </h3>
                                    <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-4">
                                        Đồ án tập trung vào việc tối ưu hóa ánh sáng cho cây thanh long bằng thiết bị nhúng và AI. Hệ thống giám sát và điều khiển ánh sáng tự động nhằm hỗ trợ canh tác thông minh và tiết kiệm năng lượng.
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Giám sát thời gian thực</h4>
                                                <p className="text-sm text-gray-600 mt-1">Theo dõi liên tục các thông số môi trường</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Phân tích dữ liệu</h4>
                                                <p className="text-sm text-gray-600 mt-1">Xử lý thông minh dữ liệu môi trường</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Tự động điều chỉnh</h4>
                                                <p className="text-sm text-gray-600 mt-1">Tối ưu ánh sáng theo giai đoạn phát triển</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-yellow-100 p-2 rounded-lg flex-shrink-0">
                                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Tiết kiệm năng lượng</h4>
                                                <p className="text-sm text-gray-600 mt-1">Giảm chi phí vận hành đến 30%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 rounded-xl text-white shadow-lg">
                                    <h3 className="text-lg font-medium mb-3 flex items-center">
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                        Thành tựu nghiên cứu
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                                            <div className="text-2xl font-bold">3+</div>
                                            <div className="text-xs opacity-80">Bài báo khoa học</div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                                            <div className="text-2xl font-bold">85%</div>
                                            <div className="text-xs opacity-80">Hiệu quả năng suất</div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                                            <div className="text-2xl font-bold">4</div>
                                            <div className="text-xs opacity-80">Giải pháp triển khai</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right - Image Carousel with Articles */}
                            <div>
                                <div className="relative w-full aspect-video bg-white rounded-xl overflow-hidden shadow-xl">
                                    <div
                                        onClick={() => {
                                            setSelectedArticle(articleData[currentIndex]);
                                            setShowModal(true);
                                        }}
                                        className="cursor-pointer group relative h-full"
                                    >
                                        <img
                                            src={articleData[currentIndex].image}
                                            alt={articleData[currentIndex].title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
                                        
                                        {/* Bottom content */}
                                        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                                            <div className="flex items-center mb-3">
                                                <div className="bg-blue-600 h-8 w-1 mr-3 rounded-full"></div>
                                                <span className="text-sm font-medium uppercase tracking-wider">Nghiên cứu {currentIndex + 1}/{articleData.length}</span>
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-blue-300 transition-colors">
                                                {articleData[currentIndex].title}
                                            </h3>
                                            <p className="text-white/80 text-sm mb-4 line-clamp-2">
                                                {articleData[currentIndex].content.substring(0, 120)}...
                                            </p>
                                            <button 
                                                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm py-2 px-4 rounded-full transition duration-300 inline-flex items-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedArticle(articleData[currentIndex]);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Xem chi tiết
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Navigation buttons */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentIndex((prev) => (prev - 1 + articleData.length) % articleData.length);
                                        }}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                                        aria-label="Previous"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentIndex((prev) => (prev + 1) % articleData.length);
                                        }}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                                        aria-label="Next"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    
                                    {/* Indicator dots */}
                                    <div className="absolute bottom-4 right-6 flex space-x-2">
                                        {articleData.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentIndex(idx);
                                                }}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    idx === currentIndex ? "bg-white w-6" : "bg-white/50"
                                                }`}
                                                aria-label={`Go to slide ${idx + 1}`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Topic tags - Enhanced version with bolder frames */}
                                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1.5 px-4 rounded-full border-2 border-blue-200 shadow-sm hover:bg-blue-200 hover:border-blue-300 transition-all cursor-pointer">IoT</span>
                                    <span className="bg-green-100 text-green-800 text-xs font-medium py-1.5 px-4 rounded-full border-2 border-green-200 shadow-sm hover:bg-green-200 hover:border-green-300 transition-all cursor-pointer">Nông nghiệp thông minh</span>
                                    <span className="bg-purple-100 text-purple-800 text-xs font-medium py-1.5 px-4 rounded-full border-2 border-purple-200 shadow-sm hover:bg-purple-200 hover:border-purple-300 transition-all cursor-pointer">AI/ML</span>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium py-1.5 px-4 rounded-full border-2 border-yellow-200 shadow-sm hover:bg-yellow-200 hover:border-yellow-300 transition-all cursor-pointer">Tiết kiệm năng lượng</span>
                                    <span className="bg-red-100 text-red-800 text-xs font-medium py-1.5 px-4 rounded-full border-2 border-red-200 shadow-sm hover:bg-red-200 hover:border-red-300 transition-all cursor-pointer">Phát triển bền vững</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section ref={teamRef} id="team" className="py-10 sm:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-3 sm:px-6">
                        <div className="text-center mb-10 sm:mb-16">
                            <h2 className="text-3xl sm:text-6xl font-serif mb-6">Meet Our Team</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                            {/* Team member card */}
                            {[1, 2,].map((idx) => {
                                const data = [
                                    {
                                        img: "/images/dohoang.jpg",
                                        name: "Đỗ Huy Hoàng",
                                        role: "Software Engineer",
                                    },
                                    {
                                        img: "/images/duchai.jpg",
                                        name: "Chu Đức Hải",
                                        role: "Software Engineer",
                                    },
                                    
                                ][idx - 1];
                                return (
                                    <div className="flex flex-col items-center text-center" key={idx}>
                                        <img
                                            src={data.img}
                                            alt={data.name}
                                            className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg border-4 border-gray-300 shadow-md mb-4"
                                        />
                                        <div className="mt-2">
                                            <h3 className="text-xl font-semibold">{data.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{data.role}</p>
                                            <p className="text-gray-700 text-sm max-w-sm mx-auto">
                                                {idx === 1 && "Specializing in AI algorithms for optimizing light conditions."}
                                                {idx === 2 && "Leading our project development and technical implementation."}
                                                {idx === 3 && "Expert in data analysis and visualization for agriculture."}
                                                {idx === 4 && "Connecting our technical solutions with market needs."}
                                            </p>
                                            <div className="mt-3 flex gap-2 justify-center">
                                                <a href={idx === 1 ? 'https://www.facebook.com/hoang.do.609212' : 
                                                          idx === 2 ? 'https://www.facebook.com/uchai.838655' : 
                                                          idx === 3 ? 'https://www.facebook.com/hieugm2103' : 
                                                          'https://www.facebook.com/solo.ko.391'} 
                                                   target="_blank" 
                                                   rel="noopener noreferrer" 
                                                   className="text-gray-600 hover:text-blue-500">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                                                    </svg>
                                                </a>
                                                {/* instagram */}
                                                <a href={`https://www.instagram.com/${idx === 1 ? 'dohoang' : idx === 2 ? 'duchai' : idx === 3 ? 'minhhieu' : 'chuong'}`} 
                                                   target="_blank" 
                                                   rel="noopener noreferrer" 
                                                   className="text-gray-600 hover:text-blue-500">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                                                    </svg>
                                                </a>
                                                {/* LinkedIn icon */}
                                                <a href={idx === 1 ? '#' : 
                                                          idx === 2 ? 'https://www.linkedin.com/in/h%E1%BA%A3i-chu-%C4%91%E1%BB%A9c-814a06252/' : 
                                                          idx === 3 ? 'https://www.linkedin.com/in/minhhieuuit/' : 
                                                          '#'}
                                                   target="_blank" 
                                                   rel="noopener noreferrer" 
                                                   className={`text-gray-600 hover:text-blue-500 ${(idx === 1 || idx === 4) ? 'opacity-50 pointer-events-none' : ''}`}>
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"></path>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Contact Us Section */}
                <section ref={contactRef} id="contact" className="py-10 sm:py-20 bg-gray-100">
                    <div className="max-w-4xl mx-auto px-3 sm:px-6">
                        <h2 className="text-3xl sm:text-5xl font-serif mb-8 sm:mb-12 text-center">Contact Us</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Email list */}
                            <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg flex flex-col">
                                <h3 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center text-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Email Us
                                </h3>
                                <div className="space-y-4 text-base sm:text-lg text-gray-800 flex-grow">
                                    <div className="flex items-center hover:bg-blue-50 p-3 rounded-md transition-all duration-300 border border-transparent hover:border-blue-100">
                                        <div className="bg-blue-100 rounded-full p-2 mr-4 flex items-center justify-center" style={{minWidth: "40px", height: "40px"}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p className="font-medium text-gray-900 mb-1">Project Lead</p>
                                            <a href="mailto:22520378@gm.uit.edu.vn" className="text-blue-600 hover:text-blue-800 transition-colors">
                                                22520378@gm.uit.edu.vn
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center hover:bg-blue-50 p-3 rounded-md transition-all duration-300 border border-transparent hover:border-blue-100">
                                        <div className="bg-blue-100 rounded-full p-2 mr-4 flex items-center justify-center" style={{minWidth: "40px", height: "40px"}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p className="font-medium text-gray-900 mb-1">Technical Support</p>
                                            <a href="mailto:22520485@gm.uit.edu.vn" className="text-blue-600 hover:text-blue-800 transition-colors">
                                                haidonglethqb@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-auto pt-6 border-t border-gray-200">
                                    <p className="text-gray-700">
                                        Our team typically responds within 24-48 hours on business days.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Social media */}
                            <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg flex flex-col">
                                <h3 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center text-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                    </svg>
                                    Connect With Us
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-4 flex-grow">
                                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" 
                                       className="flex flex-col items-center bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-100 group">
                                        <div className="bg-blue-100 rounded-full p-3 mb-3 group-hover:bg-blue-200 transition-colors duration-300">
                                            <img src="/facebook.png" alt="Facebook" className="w-8 h-8" />
                                        </div>
                                        <span className="text-gray-800 font-medium">Facebook</span>
                                        <span className="text-xs text-gray-500 mt-1">Follow our page</span>
                                    </a>
                                    
                                    <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" 
                                       className="flex flex-col items-center bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-100 group">
                                        <div className="bg-blue-100 rounded-full p-3 mb-3 group-hover:bg-blue-200 transition-colors duration-300">
                                            <img src="/tiktok.png" alt="TikTok" className="w-8 h-8" />
                                        </div>
                                        <span className="text-gray-800 font-medium">TikTok</span>
                                        <span className="text-xs text-gray-500 mt-1">Watch our videos</span>
                                    </a>
                                    
                                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" 
                                       className="flex flex-col items-center bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-100 group">
                                        <div className="bg-blue-100 rounded-full p-3 mb-3 group-hover:bg-blue-200 transition-colors duration-300">
                                            <img src="/instagram.png" alt="Instagram" className="w-8 h-8" />
                                        </div>
                                        <span className="text-gray-800 font-medium">Instagram</span>
                                        <span className="text-xs text-gray-500 mt-1">See our photos</span>
                                    </a>
                                    
                                    <a href="https://zalo.me/" target="_blank" rel="noopener noreferrer" 
                                       className="flex flex-col items-center bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-100 group">
                                        <div className="bg-blue-100 rounded-full p-3 mb-3 group-hover:bg-blue-200 transition-colors duration-300">
                                            <img src="/zalo.png" alt="Zalo" className="w-8 h-8" />
                                        </div>
                                        <span className="text-gray-800 font-medium">Zalo</span>
                                        <span className="text-xs text-gray-500 mt-1">Chat with us</span>
                                    </a>
                                </div>
                                
                                <div className="mt-auto pt-6 border-t border-gray-200">
                                    <p className="text-gray-700">
                                        Follow us on social media for the latest updates, tips, and project news.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Location/Address section (optional) */}
                        <div className="mt-8 bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                            <h3 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Find Us
                            </h3>
                            <div className="flex flex-col md:flex-row items-start md:items-center">
                                <div className="md:w-1/2">
                                    <p className="text-gray-800 mb-1 font-medium">UIT - University of Information Technology</p>
                                    <p className="text-gray-600">VNU-HCM</p>
                                    <p className="text-gray-600">Quarter 6, Linh Trung Ward, Thu Duc City, Ho Chi Minh City</p>
                                </div>
                                <div className="md:w-1/2 mt-4 md:mt-0 md:text-right">
                                    <a 
                                        href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+ngh%E1%BB%87+Th%C3%B4ng+tin+-+%C4%90HQG+TPHCM/@10.8700089,106.8008654,17z/data=!3m1!4b1!4m6!3m5!1s0x317527587e9ad5bf:0xafa66f9c8be3c91!8m2!3d10.8700089!4d106.8008654!16s%2Fm%2F02qqlmm?entry=ttu" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <span>View on Google Maps</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Add Modal for Article Details - Insert this at the end of your JSX, before the closing div */}
            {showModal && selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setShowModal(false)}>
                    <div 
                        className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[85vh] shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Phần ảnh bìa bài báo với kiểu dáng chuyên nghiệp hơn */}
                        <div className="relative h-72 md:h-96 bg-gray-100">
                            <img 
                                src={selectedArticle.image} 
                                alt={selectedArticle.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                            <button 
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
                                onClick={() => setShowModal(false)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
                                <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full mb-2 shadow-md">
                                    Nghiên cứu khoa học
                                </div>
                                <h2 className="text-xl sm:text-3xl font-bold text-white mb-1">{selectedArticle.title}</h2>
                                <p className="text-sm text-white/70 line-clamp-2 mb-1 max-w-3xl">
                                    {selectedArticle.content.substring(0, 100)}...
                                </p>
                            </div>
                        </div>
                        
                        {/* Phần thông tin tác giả được cải thiện */}
                        <div className="p-6 overflow-y-auto">
                            <div className="flex items-center border-b border-gray-200 pb-4 mb-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200">
                                    <img 
                                        src="/images/duchai.jpg" 
                                        alt="Author" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="ml-4 flex-grow">
                                    <div className="font-medium text-lg">Nhóm nghiên cứu UIT</div>
                                    <div className="text-sm text-gray-500 flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9  8h16M4 16h16M4 8h16" />
                                        </svg>
                                        Xuất bản: {new Date().toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <a 
                                        href={selectedArticle.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Nguồn bài viết
                                    </a>
                                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482  9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Nội dung bài báo với định dạng tốt hơn */}
                            <div className="prose max-w-none">
                                {selectedArticle.content.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
                                ))}
                            </div>
                            
                            {/* Từ khóa nâng cấp */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="font-medium mb-3 text-gray-700 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                    </svg>
                                    Từ khóa:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedArticle.keywords?.map((keyword, idx) => (
                                        <span key={idx} className="px-4 py-1.5 bg-gray-100 text-gray-800 text-sm rounded-full border-2 border-gray-200 shadow-sm hover:bg-gray-200 transition-all flex items-center">
                                            {keyword === "AI" && (
                                                <svg className="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                                                </svg>
                                            )}
                                            {keyword === "Máy học" && (
                                                <svg className="w-4 h-4 mr-1.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="5" cy="7" r="2"></circle>
                                                    <circle cx="5" cy="17" r="2"></circle>
                                                    <circle cx="19" cy="7" r="2"></circle>
                                                    <circle cx="19" cy="17" r="2"></circle>
                                                    <circle cx="12" cy="12" r="2"></circle>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 9l7 3 7-3m-14 0v8m14-8v8"></path>
                                                </svg>
                                            )}
                                            {keyword === "Nông nghiệp thông minh" && (
                                                <svg className="w-4 h-4 mr-1.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11a4 4 0 014-4v10a4 4 0 01-4-4zm4 6V7m4 4a4 4 0 00-4-4"></path>
                                                </svg>
                                            )}
                                            {keyword === "Tối ưu hóa năng lượng" && (
                                                <svg className="w-4 h-4 mr-1.5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            )}
                                            {keyword === "Thanh long" && (
                                                <svg className="w-4 h-4 mr-1.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                                </svg>
                                            )}
                                            {keyword === "Raspberry Pi" && (
                                                <svg className="w-4 h-4 mr-1.5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <rect x="3" y="4" width="18" height="16" rx="1"></rect>
                                                    <circle cx="8" cy="8" r="1.5"></circle>
                                                    <circle cx="16" cy="8" r="1.5"></circle>
                                                    <rect x="6" y="13" width="12" height="4" rx="0.5"></rect>
                                                </svg>
                                            )}
                                            {keyword === "IoT" && (
                                                <svg className="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                </svg>
                                            )}
                                            {/* C*/}
                                            {!["AI", "Máy học", "Nông nghiệp thông minh", "Tối ưu hóa năng lượng", "Thanh long", "Raspberry Pi", "IoT"].includes(keyword) && (
                                                <svg className="w-4 h-4 mr-1.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                                </svg>
                                            )}
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Phần footer chuyên nghiệp */}
                            <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between">
                                <div className="text-sm text-gray-500 mb-4 md:mb-0">
                                    © 2025 Dự án Nghiên cứu - Trường Đại học Công nghệ Thông tin
                                </div>
                                <div className="flex space-x-3">
                                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H17m-10 0H5a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2v-4a2 2 0 00-2-2h-2z"></path>
                                        </svg>
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
