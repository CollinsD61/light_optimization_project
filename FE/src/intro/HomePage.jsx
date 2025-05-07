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
            setIsScrolled(window.scrollY > 20); // scroll xuống 20px là đổi màu
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
            image: "/article1.jpg",
            link: "https://link-bai-bao-1.com",
            content: `Nội dung đầy đủ bài báo 1...`,
        },
        {
            title: "Tối ưu hóa năng lượng với Raspberry Pi",
            image: "/article2.jpg",
            link: "https://link-bai-bao-2.com",
            content: `Nội dung đầy đủ bài báo 2...`,
        },
        {
            title: "Cảm biến ánh sáng trong nông nghiệp",
            image: "/article3.jpg",
            link: "https://link-bai-bao-3.com",
            content: `Nội dung đầy đủ bài báo 3...`,
        },
    ];

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
                {/* Navigation Bar */}
                <nav className={`w-full py-4 px-6 fixed top-0 z-20 shadow-md backdrop-blur transition-all duration-300 
            ${isScrolled ? 'bg-white text-black' : 'bg-black/60 text-white'}`}>
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center">
                            <img src="/logo.png" alt="Light Optimization Logo" className="w-10 h-10 rounded-full" />
                            <span className={`ml-3 text-xl font-bold transition-colors duration-300 
                        ${isScrolled ? 'text-black' : 'text-white'}`}>
                                Light Optimization
                            </span>
                        </div>

                        <div className="flex items-center">
                            <div className={`flex space-x-8 mr-8 transition-colors duration-300 
                        ${isScrolled ? 'text-black' : 'text-white'}`}>
                                <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection(aboutRef); }} className="hover:text-gray-500 transition-colors duration-300">About Us</a>
                                <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection(projectsRef); }} className="hover:text-gray-500 transition-colors duration-300">Our Projects</a>
                                <a href="#team" onClick={(e) => { e.preventDefault(); scrollToSection(teamRef); }} className="hover:text-gray-500 transition-colors duration-300">Team</a>
                                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection(contactRef); }} className="hover:text-gray-500 transition-colors duration-300">Contact Us</a>
                            </div>
                            <button
                                onClick={handleSignInClick}
                                className={`border rounded px-4 py-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50
                            ${isScrolled
                                        ? 'text-black border-black hover:bg-black hover:text-white focus:ring-black'
                                        : 'text-white border-white hover:bg-white hover:text-black focus:ring-white'}`}
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="h-screen flex items-center-safe justify-center mt-16">
                    <h1 className="text-white text-4xl font-bold drop-shadow-lg"></h1>
                </div>

                {/* About Us Section */}
                <section ref={aboutRef} id="about" className="bg-white">
                    <div className="p-8 md:px-16 py-16">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row md:h-full">
                                {/* Left side - Image */}
                                <div className="md:w-1/2">
                                    <div className="h-full">
                                        <img
                                            src="/about us.jpg"
                                            alt="Dragon fruit plants with lighting optimization"
                                            className="w-full h-full object-cover rounded"
                                            style={{ height: '100%' }}
                                        />
                                    </div>
                                </div>

                                {/* Right side - Text */}
                                <div className="md:w-1/2 md:pl-12 flex flex-col justify-center">
                                    <h2 className="text-6xl font-serif mb-10">About Us</h2>
                                    <div className="space-y-6 text-lg text-justify leading-relaxed">
                                        <p>
                                            Chúng tôi là nhóm gồm 4 sinh viên thực hiện đồ án chuyên ngành
                                            với đề tài "Tối ưu hóa ánh sáng cho cây thanh long bằng thiết bị
                                            nhúng và trí tuệ nhân tạo". Đồ án tập trung vào việc kết hợp giữa cảm
                                            biến (Arduino), bộ xử lý (Raspberry Pi) và mô hình AI để theo dõi,
                                            điều chỉnh và dự đoán nhu cầu ánh sáng phù hợp với từng giai đoạn
                                            phát triển của cây.
                                        </p>
                                        <p>
                                            Mỗi thành viên trong nhóm đảm nhận một vai trò cụ thể như lập
                                            trình hệ thống cảm biến, xây dựng mô hình AI, thiết kế phần cứng và
                                            phân tích dữ liệu. Với tinh thần sáng tạo và niềm đam mê với công
                                            nghệ nông nghiệp, nhóm mong muốn đóng góp một giải pháp hiệu
                                            quả và bền vững cho lĩnh vực canh tác thông minh.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Our Projects Section */}
                <section ref={projectsRef} id="projects" className="bg-gray-100">
                    <div className="px-8 md:px-20 py-16">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-10">
                                {/* Left - Giới thiệu chung */}
                                <div className="md:w-1/2">
                                    <h2 className="text-6xl font-serif mb-10">Our Projects</h2>
                                    <p className="text-lg leading-relaxed text-justify">
                                        Đồ án tập trung vào việc tối ưu hóa ánh sáng cho cây thanh long bằng thiết bị nhúng và AI.
                                        Hệ thống giám sát và điều khiển ánh sáng tự động nhằm hỗ trợ canh tác thông minh và tiết kiệm năng lượng.
                                        Dưới đây là ba bài báo khoa học liên quan đến dự án mà nhóm chúng tôi đã tham khảo hoặc xây dựng.
                                    </p>
                                </div>

                                {/* Right - Banner carousel */}
                                <div className="md:w-1/2">
                                    <div
                                        className="relative w-full h-64 md:h-80 rounded overflow-hidden shadow-lg cursor-pointer"
                                        onClick={() => {
                                            setSelectedArticle(articleData[currentIndex]);
                                            setShowModal(true);
                                        }}
                                    >
                                        <img
                                            src={articleData[currentIndex].image}
                                            alt={articleData[currentIndex].title}
                                            className="w-full h-full object-cover transition duration-500"
                                        />
                                        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 text-white">
                                            <h3 className="text-xl font-semibold">{articleData[currentIndex].title}</h3>
                                        </div>

                                        {/* Nút ← */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentIndex((prev) => (prev - 1 + articleData.length) % articleData.length);
                                            }}
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow"
                                            aria-label="Previous"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-black"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>


                                        {/* Nút → */}
                                        {/* Nút → giống hình */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentIndex((prev) => (prev + 1) % articleData.length);
                                            }}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow"
                                            aria-label="Next"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-black"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Modal đọc bài báo */}
                    {showModal && selectedArticle && (
                        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
                            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg p-6 relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
                                    onClick={() => setShowModal(false)}
                                >
                                    &times;
                                </button>
                                <h2 className="text-3xl font-bold mb-4">{selectedArticle.title}</h2>
                                <p className="text-lg text-justify leading-relaxed whitespace-pre-line">
                                    {selectedArticle.content}
                                </p>
                                <a
                                    href={selectedArticle.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block mt-4 text-blue-600 underline"
                                >
                                    Đọc bài gốc tại đây
                                </a>
                            </div>
                        </div>
                    )}
                </section>



                {/* Team Section */}
                <section ref={teamRef} id="team" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-6xl font-serif mb-10d">Meet Our Team</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Member 1 */}
                            <div className="flex gap-6">
                                <img
                                    src="/team1.jpg"
                                    alt="Đỗ Huy Hoàng"
                                    className="w-40 h-40 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold">Đỗ Huy Hoàng</h3>
                                    <p className="text-sm text-gray-600 mb-2">Founder</p>
                                    <p className="text-gray-700">
                                        This is an example paragraph. You can replace the content here with your own text. This is an example paragraph.
                                    </p>
                                </div>
                            </div>

                            {/* Member 2 */}
                            <div className="flex gap-6">
                                <img
                                    src="/team2.jpg"
                                    alt="Chu Đức Hải"
                                    className="w-40 h-40 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold">Chu Đức Hải</h3>
                                    <p className="text-sm text-gray-600 mb-2">Project Manager</p>
                                    <p className="text-gray-700">
                                        This is an example paragraph. You can replace the content here with your own text. This is an example paragraph.
                                    </p>
                                </div>
                            </div>

                            {/* Member 3 */}
                            <div className="flex gap-6">
                                <img
                                    src="/team3.jpg"
                                    alt="Trịnh Minh Hiếu"
                                    className="w-40 h-40 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold">Trịnh Minh Hiếu</h3>
                                    <p className="text-sm text-gray-600 mb-2">Data Analyst</p>
                                    <p className="text-gray-700">
                                        This is an example paragraph. You can replace the content here with your own text. This is an example paragraph.
                                    </p>
                                </div>
                            </div>

                            {/* Member 4 */}
                            <div className="flex gap-6">
                                <img
                                    src="/team4.jpg"
                                    alt="Bùi Đức Chương"
                                    className="w-40 h-40 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold">Bùi Đức Chương</h3>
                                    <p className="text-sm text-gray-600 mb-2">Marketing Specialist</p>
                                    <p className="text-gray-700">
                                        This is an example paragraph. You can replace the content here with your own text. This is an example paragraph.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Contact Us Section */}
                <section ref={contactRef} id="contact" className="py-20 bg-gray-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-5xl font-serif mb-8">Contact Us</h2>

                        {/* Email list */}
                        <div className="mb-10">
                            <h3 className="text-2xl font-semibold mb-2">Email address</h3>
                            <div className="space-y-1 text-lg text-gray-800">
                                <p>22520485@gm.uit.edu.vn</p>
                                <p>22520485@gm.uit.edu.vn</p>
                                <p>22520485@gm.uit.edu.vn</p>
                                <p>22520485@gm.uit.edu.vn</p>
                            </div>
                        </div>

                        {/* Social media */}
                        <div>
                            <h3 className="text-3xl font-serif mb-4">Via social media</h3>
                            <div className="flex gap-4 flex-wrap">
                                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                                    <img src="/facebook.png" alt="Facebook" className="w-10 h-10" />
                                </a>
                                <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
                                    <img src="/tiktok.png" alt="TikTok" className="w-10 h-10" />
                                </a>
                                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                                    <img src="/instagram.png" alt="Instagram" className="w-10 h-10" />
                                </a>
                                <a href="https://zalo.me/" target="_blank" rel="noopener noreferrer">
                                    <img src="/zalo.png" alt="Zalo" className="w-10 h-10" />
                                </a>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
