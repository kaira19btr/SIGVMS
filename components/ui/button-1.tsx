'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type ColorKey =
  | 'color1'
  | 'color2'
  | 'color3'
  | 'color4'
  | 'color5'
  | 'color6'
  | 'color7'
  | 'color8'
  | 'color9'
  | 'color10'
  | 'color11'
  | 'color12'
  | 'color13'
  | 'color14'
  | 'color15'
  | 'color16'
  | 'color17';

export type Colors = Record<ColorKey, string>;

const svgOrder = [
  'svg1',
  'svg2',
  'svg3',
  'svg4',
  'svg3',
  'svg2',
  'svg1',
] as const;

type SvgKey = (typeof svgOrder)[number];

type Stop = {
  offset: number;
  stopColor: string;
};

type SvgState = {
  gradientTransform: string;
  stops: Stop[];
};

type SvgStates = Record<SvgKey, SvgState>;

const createStopsArray = (
  svgStates: SvgStates,
  svgOrder: readonly SvgKey[],
  maxStops: number
): Stop[][] => {
  let stopsArray: Stop[][] = [];
  for (let i = 0; i < maxStops; i++) {
    let stopConfigurations = svgOrder.map((svgKey) => {
      let svg = svgStates[svgKey];
      return svg.stops[i] || svg.stops[svg.stops.length - 1];
    });
    stopsArray.push(stopConfigurations);
  }
  return stopsArray;
};

type GradientSvgProps = {
  className: string;
  isHovered: boolean;
  colors: Colors;
};

const GradientSvg: React.FC<GradientSvgProps> = ({
  className,
  isHovered,
  colors,
}) => {
  const svgStates: SvgStates = {
    svg1: {
      gradientTransform:
        'translate(287.5 280) rotate(-29.0546) scale(689.807 1000)',
      stops: [
        { offset: 0, stopColor: colors.color1 },
        { offset: 0.188423, stopColor: colors.color2 },
        { offset: 0.260417, stopColor: colors.color3 },
        { offset: 0.328792, stopColor: colors.color4 },
        { offset: 0.328892, stopColor: colors.color5 },
        { offset: 0.328992, stopColor: colors.color1 },
        { offset: 0.442708, stopColor: colors.color6 },
        { offset: 0.537556, stopColor: colors.color7 },
        { offset: 0.631738, stopColor: colors.color1 },
        { offset: 0.725645, stopColor: colors.color8 },
        { offset: 0.817779, stopColor: colors.color9 },
        { offset: 0.84375, stopColor: colors.color10 },
        { offset: 0.90569, stopColor: colors.color1 },
        { offset: 1, stopColor: colors.color11 },
      ],
    },
    svg2: {
      gradientTransform:
        'translate(126.5 418.5) rotate(-64.756) scale(533.444 773.324)',
      stops: [
        { offset: 0, stopColor: colors.color1 },
        { offset: 0.104167, stopColor: colors.color12 },
        { offset: 0.182292, stopColor: colors.color13 },
        { offset: 0.28125, stopColor: colors.color1 },
        { offset: 0.328792, stopColor: colors.color4 },
        { offset: 0.328892, stopColor: colors.color5 },
        { offset: 0.453125, stopColor: colors.color6 },
        { offset: 0.515625, stopColor: colors.color7 },
        { offset: 0.631738, stopColor: colors.color1 },
        { offset: 0.692708, stopColor: colors.color8 },
        { offset: 0.75, stopColor: colors.color14 },
        { offset: 0.817708, stopColor: colors.color9 },
        { offset: 0.869792, stopColor: colors.color10 },
        { offset: 1, stopColor: colors.color1 },
      ],
    },
    svg3: {
      gradientTransform:
        'translate(264.5 339.5) rotate(-42.3022) scale(946.451 1372.05)',
      stops: [
        { offset: 0, stopColor: colors.color1 },
        { offset: 0.188423, stopColor: colors.color2 },
        { offset: 0.307292, stopColor: colors.color1 },
        { offset: 0.328792, stopColor: colors.color4 },
        { offset: 0.328892, stopColor: colors.color5 },
        { offset: 0.442708, stopColor: colors.color15 },
        { offset: 0.537556, stopColor: colors.color16 },
        { offset: 0.631738, stopColor: colors.color1 },
        { offset: 0.725645, stopColor: colors.color17 },
        { offset: 0.817779, stopColor: colors.color9 },
        { offset: 0.84375, stopColor: colors.color10 },
        { offset: 0.90569, stopColor: colors.color1 },
        { offset: 1, stopColor: colors.color11 },
      ],
    },
    svg4: {
      gradientTransform:
        'translate(860.5 420) rotate(-153.984) scale(957.528 1388.11)',
      stops: [
        { offset: 0.109375, stopColor: colors.color11 },
        { offset: 0.171875, stopColor: colors.color2 },
        { offset: 0.260417, stopColor: colors.color13 },
        { offset: 0.328792, stopColor: colors.color4 },
        { offset: 0.328892, stopColor: colors.color5 },
        { offset: 0.328992, stopColor: colors.color1 },
        { offset: 0.442708, stopColor: colors.color6 },
        { offset: 0.515625, stopColor: colors.color7 },
        { offset: 0.631738, stopColor: colors.color1 },
        { offset: 0.692708, stopColor: colors.color8 },
        { offset: 0.817708, stopColor: colors.color9 },
        { offset: 0.869792, stopColor: colors.color10 },
        { offset: 1, stopColor: colors.color11 },
      ],
    },
  };

  const maxStops = Math.max(
    ...Object.values(svgStates).map((svg) => svg.stops.length)
  );
  const stopsAnimationArray = createStopsArray(svgStates, svgOrder, maxStops);
  const gradientTransform = svgOrder.map(
    (svgKey) => svgStates[svgKey].gradientTransform
  );

  const variants = {
    hovered: {
      gradientTransform: gradientTransform,
      transition: { duration: 50, repeat: Infinity, ease: 'linear' as const },
    },
    notHovered: {
      gradientTransform: gradientTransform,
      transition: { duration: 10, repeat: Infinity, ease: 'linear' as const },
    },
  };

  return (
    <svg
      className={className}
      width='1030'
      height='280'
      viewBox='0 0 1030 280'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        width='1030'
        height='280'
        rx='140'
        fill='url(#paint0_radial_905_231)'
      />
      <defs>
        <motion.radialGradient
          id='paint0_radial_905_231'
          cx='0'
          cy='0'
          r='1'
          gradientUnits='userSpaceOnUse'
          animate={isHovered ? variants.hovered : variants.notHovered}
        >
          {stopsAnimationArray.map((stopConfigs, index) => (
            <AnimatePresence key={index}>
              <motion.stop
                initial={{
                  offset: stopConfigs[0].offset,
                  stopColor: stopConfigs[0].stopColor,
                }}
                animate={{
                  offset: stopConfigs.map((config) => config.offset),
                  stopColor: stopConfigs.map((config) => config.stopColor),
                }}
                transition={{
                  duration: 0,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              />
            </AnimatePresence>
          ))}
        </motion.radialGradient>
      </defs>
    </svg>
  );
};

type LiquidProps = {
  isHovered: boolean;
  colors: Colors;
};

export const Liquid: React.FC<LiquidProps> = ({ isHovered, colors }) => {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className={`absolute ${
            index < 3 ? 'w-[443px] h-[121px]' : 'w-[756px] h-[207px]'
          } ${
            index === 0
              ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-difference'
              : index === 1
                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[164.971deg] mix-blend-difference'
                : index === 2
                  ? 'top-1/2 left-1/2 -translate-x-[53%] -translate-y-[53%] rotate-[-11.61deg] mix-blend-difference'
                  : index === 3
                    ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-[57%] rotate-[-179.012deg] mix-blend-difference'
                    : index === 4
                      ? 'top-1/2 left-1/2 -translate-x-[57%] -translate-y-1/2 rotate-[-29.722deg] mix-blend-difference'
                      : index === 5
                        ? 'top-1/2 left-1/2 -translate-x-[62%] -translate-y-[24%] rotate-[160.227deg] mix-blend-difference'
                        : 'top-1/2 left-1/2 -translate-x-[67%] -translate-y-[29%] rotate-180 mix-blend-hard-light'
          }`}
        >
          <GradientSvg
            className='w-full h-full'
            isHovered={isHovered}
            colors={colors}
          />
        </div>
      ))}
    </>
  );
};

/* --- Thematic Palettes tuned for Eco-Gov & GVMS App --- */
export const GREEN_LIQUID_COLORS: Colors = {
  color1: '#FFFFFF',
  color2: '#047857',
  color3: '#34D399',
  color4: '#ECFDF5',
  color5: '#F0FDF4',
  color6: '#6EE7B7',
  color7: '#065F46',
  color8: '#044E32',
  color9: '#10B981',
  color10: '#A7F3D0',
  color11: '#022C1A',
  color12: '#D1FAE5',
  color13: '#064E3B',
  color14: '#86EFAC',
  color15: '#BBF7D0',
  color16: '#059669',
  color17: '#15803D',
};

export const GOLD_LIQUID_COLORS: Colors = {
  color1: '#FFFFFF',
  color2: '#D97706',
  color3: '#FDE68A',
  color4: '#FEF3C7',
  color5: '#FFFBEB',
  color6: '#FCD34D',
  color7: '#B45309',
  color8: '#92400E',
  color9: '#F59E0B',
  color10: '#FEF08A',
  color11: '#78350F',
  color12: '#FEF9C3',
  color13: '#B45309',
  color14: '#FDE047',
  color15: '#FEF08A',
  color16: '#D97706',
  color17: '#CA8A04',
};

export const BLUE_LIQUID_COLORS: Colors = {
  color1: '#FFFFFF',
  color2: '#1E10C5',
  color3: '#9089E2',
  color4: '#FCFCFE',
  color5: '#F9F9FD',
  color6: '#B2B8E7',
  color7: '#0E2DCB',
  color8: '#0017E9',
  color9: '#4743EF',
  color10: '#7D7BF4',
  color11: '#0B06FC',
  color12: '#C5C1EA',
  color13: '#1403DE',
  color14: '#B6BAF6',
  color15: '#C1BEEB',
  color16: '#290ECB',
  color17: '#3F4CC0',
};

export const DARK_LIQUID_COLORS: Colors = {
  color1: '#FFFFFF',
  color2: '#1F2937',
  color3: '#9CA3AF',
  color4: '#F9FAFB',
  color5: '#F3F4F6',
  color6: '#D1D5DB',
  color7: '#111827',
  color8: '#030712',
  color9: '#374151',
  color10: '#E5E7EB',
  color11: '#000000',
  color12: '#F3F4F6',
  color13: '#111827',
  color14: '#D1D5DB',
  color15: '#E5E7EB',
  color16: '#1F2937',
  color17: '#4B5563',
};

export interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'green' | 'gold' | 'blue' | 'dark';
  customColors?: Colors;
  className?: string;
  containerClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  variant = 'green',
  customColors,
  className = '',
  containerClassName = '',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled,
  type = 'button',
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const colors = customColors || (
    variant === 'gold'
      ? GOLD_LIQUID_COLORS
      : variant === 'blue'
      ? BLUE_LIQUID_COLORS
      : variant === 'dark'
      ? DARK_LIQUID_COLORS
      : GREEN_LIQUID_COLORS
  );

  const borderColor =
    variant === 'gold'
      ? 'border-[#FACC15]/80'
      : variant === 'blue'
      ? 'border-indigo-400/80'
      : variant === 'dark'
      ? 'border-slate-500/80'
      : 'border-emerald-400/80';

  const glowBg =
    variant === 'gold'
      ? 'bg-[#451A03]'
      : variant === 'blue'
      ? 'bg-[#010128]'
      : variant === 'dark'
      ? 'bg-[#090D16]'
      : 'bg-[#022110]';

  const sizeClasses =
    size === 'sm'
      ? 'h-9 px-3.5 text-xs'
      : size === 'lg'
      ? 'h-13 px-6 text-sm md:text-base'
      : 'h-11 px-4.5 text-xs sm:text-sm';

  return (
    <div className={`relative inline-flex ${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      <div
        className={`relative inline-block ${fullWidth ? 'w-full' : ''} ${sizeClasses} group overflow-hidden rounded-xl border-2 ${borderColor} transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98] ${
          disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
        } ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Outer Glow Halo with Liquid noise */}
        <div className="absolute w-[115%] h-[135%] top-[5%] left-1/2 -translate-x-1/2 filter blur-[14px] opacity-70 pointer-events-none">
          <span className="absolute inset-0 rounded-xl bg-white/20 filter blur-[5px]" />
          <div className="relative w-full h-full overflow-hidden rounded-xl">
            <Liquid isHovered={isHovered} colors={colors} />
          </div>
        </div>

        {/* Deep Backdrop Glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[95%] h-[115%] rounded-xl ${glowBg} filter blur-[7px] pointer-events-none`}
        />

        {/* Core Liquid Body */}
        <div className="relative w-full h-full overflow-hidden rounded-xl pointer-events-none">
          <span className="absolute inset-0 rounded-xl bg-black/40" />
          <Liquid isHovered={isHovered} colors={colors} />
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`absolute inset-0 rounded-xl border border-white/30 mix-blend-overlay filter ${
                i === 1 ? 'blur-[1px]' : 'blur-[2px]'
              }`}
            />
          ))}
          <span
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[80%] h-[50%] rounded-xl filter blur-[12px] ${glowBg} opacity-80`}
          />
        </div>

        {/* Button Content Trigger */}
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          className="absolute inset-0 w-full h-full rounded-xl bg-transparent cursor-pointer flex items-center justify-center font-bold tracking-wide text-white select-none z-10 px-3"
          {...rest}
        >
          <span className="flex items-center justify-center gap-2 drop-shadow-md text-white font-extrabold whitespace-nowrap">
            {children}
          </span>
        </button>
      </div>
    </div>
  );
};
