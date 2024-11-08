/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.resolve.alias.canvas = false;

		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https", // Specify the protocol (http or https)
				hostname: "resources.humanglemedia.com", // Your hostname (e.g., foi.humanglemedia.com)
				port: "", // Leave empty if not applicable
				pathname: "/foi/org_img/**", // Specify the path where your images are located
			},
		],
	},
};

export default nextConfig;
