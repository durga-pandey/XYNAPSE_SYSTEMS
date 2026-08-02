import { FaPhone, FaWhatsapp, FaRegCommentDots } from "react-icons/fa";

const FloatingAction = () => {
  return (
    <div>
      <div className="fixed bottom-5 right-5 flex flex-col gap-6 z-50">
        {/* 📞 Call */}
        <a
          href="tel:+917309900393"
          className="bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform transform origin-center animate-pulse-scale"
        >
          <FaPhone size={20} />
        </a>

        {/* 💬 WhatsApp */}
        <a
          href="https://wa.me/917309900393"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-lg transition-transform transform origin-center animate-pulse-scale animation-delay-200"
        >
          <FaWhatsapp size={20} />
        </a>

        {/* 💭 Chat */}
        <a
          href="#chat"
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform transform origin-center animate-pulse-scale animation-delay-400"
        >
          <FaRegCommentDots size={20} />
        </a>
      </div>
    </div>
  );
};

export default FloatingAction;
