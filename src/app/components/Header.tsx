import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { usePathname, useRouter } from 'next/navigation';

type HeaderType = {
	lng: string
}

const Header = ({ lng }: HeaderType) => {
	const pathName = usePathname();
	const router = useRouter();

	const handleChange = (event: SelectChangeEvent) => {
		const newLng = event.target.value
		if (!pathName) return '/'
		const segments = pathName.split('/')
		segments[1] = newLng
		const newRoute = segments.join('/')
		router.push(newRoute);
	}

	return (
		<Grid container justifyContent="flex-end">
			<FormControl sx={{ m: 0, minWidth: 60, }} size="small">
				<Select
					labelId="language-select"
					id="language-select"
					value={lng}
					onChange={handleChange}
					style={{marginTop:5,marginRight:5}}
				>
					<MenuItem value="en">EN</MenuItem>
					<MenuItem value="es">ES</MenuItem>
				</Select>
			</FormControl>
		</Grid>
	)
}

export default Header