import { FaRegEye, FaDatabase, FaCookieBite } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { IoIosWarning } from "react-icons/io";
import ShieldIcon from "./ShieldIcon";
import { IconContext } from "react-icons";

const features = [
  {
    title: "No Tracking, No Google Ads",
    description: "We never sell your data or show you ads you don't want.",
  },
  {
    title: "Spam & Malware Protection",
    description:
      "Our automatic filtering keeps your temporary inbox clean and safe.",
  },
  {
    title: "Accessible for Everyone",
    description: "Full support for dark, light, and high-contrast themes.",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-sans text-4xl font-semibold tracking-tighter mb-16 text-center">
          Built for Privacy & Accessibility
        </h2>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Main Feature */}
          <div className="relative md:col-span-2 bg-background border border-border rounded-2xl p-8 h-full overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-sans text-2xl font-medium tracking-tight mb-2">
                {features[0].title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg max-w-md">
                {features[0].description}
              </p>
            </div>
            {/* Icon assembly */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full -translate-y-1/2 w-[32rem] h-[32rem]">
              <div className="relative w-full h-full">
                {/* Main Shield */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldIcon />
                </div>

                {/* Orbiting Icons - Manually Positioned */}
                <div
                  className="absolute"
                  style={{
                    top: "38%",
                    left: "21%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary border border-border">
                    <IconContext.Provider
                      value={{ className: "w-6 h-6 text-foreground" }}
                    >
                      <FaRegEye />
                    </IconContext.Provider>
                  </div>
                </div>
                <div
                  className="absolute"
                  style={{
                    top: "25%",
                    left: "32.5%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary border border-border">
                    <IconContext.Provider
                      value={{ className: "w-6 h-6 text-foreground" }}
                    >
                      <HiSpeakerphone />
                    </IconContext.Provider>
                  </div>
                </div>
                <div
                  className="absolute"
                  style={{
                    top: "20%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary border border-border">
                    <IconContext.Provider
                      value={{ className: "w-6 h-6 text-foreground" }}
                    >
                      <IoIosWarning />
                    </IconContext.Provider>
                  </div>
                </div>
                <div
                  className="absolute"
                  style={{
                    top: "25%",
                    left: "67.5%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary border border-border">
                    <IconContext.Provider
                      value={{ className: "w-6 h-6 text-foreground" }}
                    >
                      <FaDatabase />
                    </IconContext.Provider>
                  </div>
                </div>
                <div
                  className="absolute"
                  style={{
                    top: "38%",
                    left: "79%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary border border-border">
                    <IconContext.Provider
                      value={{ className: "w-6 h-6 text-foreground" }}
                    >
                      <FaCookieBite />
                    </IconContext.Provider>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Features */}
          <div className="space-y-8">
            <div className="bg-secondary border border-border/50 rounded-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <h3 className="font-sans text-xl font-medium tracking-tight mb-2">
                {features[1].title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {features[1].description}
              </p>
            </div>
            <div className="bg-secondary border border-border/50 rounded-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <h3 className="font-sans text-xl font-medium tracking-tight mb-2">
                {features[2].title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {features[2].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
