"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(1),
    message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

export function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const t = useTranslations("contact");
    const tv = useTranslations("contact.validation");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(
            z.object({
                name: z.string().min(2, tv("name_min")),
                email: z.string().email(tv("email_invalid")),
                subject: z.string().min(1, tv("subject_required")),
                message: z.string().min(10, tv("message_min")),
            })
        ),
    });

    const onSubmit = async (data: FormData) => {
        setStatus("sending");
        try {
            // EmailJS integration
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

            if (serviceId && templateId && publicKey) {
                const emailjs = await import("@emailjs/browser");
                await emailjs.send(serviceId, templateId, {
                    from_name: data.name,
                    from_email: data.email,
                    subject: data.subject,
                    message: data.message,
                }, publicKey);
            } else {
                // Demo mode: simulate success
                await new Promise((r) => setTimeout(r, 1500));
            }

            setStatus("success");
            reset();
            setTimeout(() => { setStatus("idle"); onClose(); }, 3000);
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const inputCls = `w-full px-4 py-3 rounded-none bg-[#0a0a0a] border-t border-l border-r border-b-2 border-white/10 text-white font-mono text-xs tracking-wider uppercase
    placeholder-white/20 focus:outline-none focus:border-b-[#CC2200] focus:bg-[#CC2200]/5
    transition-all duration-200`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t("modal_title")} size="lg">
            {status === "success" ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <div className="w-20 h-20 rounded-none bg-[#CC2200]/10 border border-[#CC2200]/30 shadow-[0_0_20px_rgba(204,34,0,0.2)] flex items-center justify-center transform rotate-45">
                        <CheckCircle size={32} className="text-[#CC2200] -rotate-45" />
                    </div>
                    <p className="text-[#CC2200] font-mono font-bold uppercase tracking-[0.2em] mt-4">&gt;_ {t("success")}</p>
                </div>
            ) : status === "error" ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <div className="w-20 h-20 rounded-none bg-red-500/10 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center justify-center transform rotate-45">
                        <AlertCircle size={32} className="text-red-500 -rotate-45" />
                    </div>
                    <p className="text-red-500 font-mono font-bold uppercase tracking-[0.2em] mt-4">&gt;_ SYSTEM ERROR: {t("error")}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="contact-name" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                            {t("name_label")}
                        </label>
                        <input
                            {...register("name")}
                            id="contact-name"
                            type="text"
                            placeholder={t("name_placeholder")}
                            className={`${inputCls} ${errors.name ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="contact-email" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                            {t("email_label")}
                        </label>
                        <input
                            {...register("email")}
                            id="contact-email"
                            type="email"
                            placeholder={t("email_placeholder")}
                            className={`${inputCls} ${errors.email ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                        <label htmlFor="contact-subject" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                            {t("subject_label")}
                        </label>
                        <input
                            {...register("subject")}
                            id="contact-subject"
                            type="text"
                            placeholder={t("subject_placeholder")}
                            className={`${inputCls} ${errors.subject ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
                        />
                        {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                    </div>

                    {/* Message */}
                    <div>
                        <label htmlFor="contact-message" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                            {t("message_label")}
                        </label>
                        <textarea
                            {...register("message")}
                            id="contact-message"
                            rows={5}
                            placeholder={t("message_placeholder")}
                            className={`${inputCls} resize-none ${errors.message ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
                        />
                        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="mt-6 flex items-center justify-center gap-2 px-8 py-4
              rounded-none bg-[#CC2200]/10 hover:bg-[#CC2200] border-2 border-[#CC2200]/50 hover:border-[#CC2200]
              disabled:opacity-50 disabled:cursor-not-allowed text-[#f0ede8] text-xs font-mono font-bold tracking-[0.2em] uppercase
              transition-all duration-300 shadow-[0_0_15px_rgba(204,34,0,0.1)] hover:shadow-[0_0_30px_rgba(204,34,0,0.4)]
              focus-visible:outline-none focus-visible:bg-[#CC2200]"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
                    >
                        {status === "sending" ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-[#CC2200] rounded-none animate-spin" />
                                &gt;_ {t("sending")}
                            </>
                        ) : (
                            <>
                                <Send size={15} className="mr-2" />
                                [ {t("submit")} ]
                            </>
                        )}
                    </button>
                </form>
            )}
        </Modal>
    );
}
