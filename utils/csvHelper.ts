import { Company } from '../types';

function escapeCSV(field: string | undefined | null | number): string {
    if (field === null || field === undefined) {
        return '""';
    }
    const str = String(field);
    // If the field contains a comma, double quote, or newline, wrap it in double quotes.
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        // Within a double-quoted field, any double quote must be escaped by another double quote.
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export const downloadAsCSV = (data: Company[], domain: string) => {
    if (data.length === 0) return;

    const headers = ['Name', 'Status', 'Location', 'Description', 'Investment', 'Website', 'Google Maps URL', 'Employee Count', 'Established Year'];
    const csvRows = [headers.join(',')];

    for (const company of data) {
        const values = [
            escapeCSV(company.name),
            escapeCSV(company.status),
            escapeCSV(company.location),
            escapeCSV(company.description),
            escapeCSV(company.investment),
            escapeCSV(company.website),
            escapeCSV(company.googleMapsUrl),
            escapeCSV(company.employeeCount),
            escapeCSV(company.establishedYear),
        ];
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        const fileName = `${domain.replace(/\s+/g, '_')}_companies.csv`;
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};