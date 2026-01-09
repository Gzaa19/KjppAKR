import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function ContactInfoSection() {
    const contactInfo = [
        {
            icon: MapPin,
            title: "Alamat Kantor",
            content: "Permata Kebayoran Plaza Blok A-12A Jl. Raya Kebayoran Lama No. 225 Jakarta 12220, Indonesia",
            action: "https://maps.app.goo.gl/gy4uq1a69G6NQyCY6"
        },
        {
            icon: Phone,
            title: "Telepon / WhatsApp",
            content: "+62 21 7883 9696",
            action: "tel:+622178839696"
        },
        {
            icon: Mail,
            title: "Email",
            content: "admin@kjpp-akr.com",
            action: "mailto:admin@kjpp-akr.com"
        },
        {
            icon: Clock,
            title: "Jam Operasional",
            content: "Senin - Jumat: 08.00 - 17.00 WIB",
            action: null
        }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {contactInfo.map((info, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group text-center"
                        >
                            <div className="w-16 h-16 bg-kjpp-red/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-kjpp-red transition-colors duration-300">
                                <info.icon className="w-8 h-8 text-kjpp-red group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="font-bold text-lg text-kjpp-dark mb-3">{info.title}</h3>
                            {info.action ? (
                                <a
                                    href={info.action}
                                    target={info.action.startsWith('http') ? "_blank" : undefined}
                                    rel={info.action.startsWith('http') ? "noopener noreferrer" : undefined}
                                    className="text-slate-600 hover:text-kjpp-red transition-colors leading-relaxed block"
                                >
                                    {info.content}
                                </a>
                            ) : (
                                <p className="text-slate-600 leading-relaxed">
                                    {info.content}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm overflow-hidden">
                    <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-slate-100">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2296117375!2d106.77826767534307!3d-6.23343386104407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f124985fb7e3%3A0xf9deb1d86919e83d!2sKJPP%20Anas%20Karim%20Rivai%20%26%20Rekan(AKR)!5e0!3m2!1sen!2sid!4v1767943722393!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
