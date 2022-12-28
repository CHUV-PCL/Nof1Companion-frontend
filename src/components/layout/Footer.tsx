import useTranslation from 'next-translate/useTranslation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import Image from 'next/image';

export default function Footer() {
	const { t } = useTranslation('common');

	return (
		<footer>
			<Box
				bgcolor="primary.main"
				paddingY={1}
				color="primary.contrastText"
				boxShadow={
					'0px -2px 4px -1px rgb(0 0 0 / 20%), 0px -4px 5px 0px rgb(0 0 0 / 14%), 0px -1px 10px 0px rgb(0 0 0 / 12%)'
				}
			>
				<Container maxWidth="lg">
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						spacing={2}
					>
						<Box padding={1} pt={0}>
							<Typography variant="subtitle1" fontWeight="bold">
								{t('nav.title')}
							</Typography>
							<Typography variant="body2">
								{t('footer.1')}
								<Link
									underline="hover"
									color="inherit"
									href="https://www.chuv.ch/fr/pcl/pcl-home/"
									target="_blank"
									rel={'noopener'}
								>
									{t('footer.pcl')}
								</Link>
								<br />
								{t('footer.2')}
								<Link
									underline="hover"
									color="inherit"
									href="https://heig-vd.ch"
									target="_blank"
									rel={'noopener'}
								>
									{t('footer.heig')}
								</Link>
							</Typography>
						</Box>
						<Box minWidth={180}>
							<a title="CHUV" href="https://www.chuv.ch/fr/pcl/pcl-home/">
								<Image
									width="102"
									height="53"
									alt="CHUV logo"
									src="/CHUV.svg"
								/>
							</a>
							<Box component="span" ml={1}>
								<a title="CHUV" href="https://heig-vd.ch">
									<Image
										width="66"
										height="50"
										alt="HEIG-VD logo"
										src="/HEIG-VD.svg"
									/>
								</a>
							</Box>
						</Box>
					</Stack>

					<Divider />

					<Box padding={1} pb={0}>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography variant="body2">
								Made with ❤️ in Switzerland (2022). Developed by{' '}
								<Link
									underline="hover"
									color="inherit"
									href="https://ch.linkedin.com/in/daniel-sciarra-3b9247140"
									target="_blank"
									rel={'noopener'}
								>
									Sciarra Daniel
								</Link>
							</Typography>
							<Stack direction="row" alignItems="center" spacing={1}>
								<Link
									title="github link"
									href="https://github.com/DS-Daniel/Nof1-App"
									target={'_blank'}
									rel={'noopener'}
									sx={{
										display: 'inline-flex',
										cursor: 'pointer',
										padding: 1,
										borderRadius: 2,
										border: '2px solid',
										borderColor: 'primary.contrastText',
										color: 'primary.contrastText',
										transition: '0.3s ease-out',
										'&:hover, &:focus': {
											boxShadow: `0 0 8px 0`,
											borderColor: 'text.secondary',
											color: 'text.primary',
										},
									}}
								>
									<GitHubIcon
										sx={{
											transition:
												'0.2s cubic-bezier(.47,1.64,.41,.8), color 0s',
										}}
									/>
								</Link>
								<Typography variant="caption" component="span">
									Distributed under GNU AGPLv3 License
								</Typography>
							</Stack>
						</Stack>
					</Box>
				</Container>
			</Box>
		</footer>
	);
}
