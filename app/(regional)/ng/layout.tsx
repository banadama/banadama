export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Banadama Nigeria | Banadama Naija',
    description: 'Nigeria-specific marketplace and services portal',
};

export default function NigeriaLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="ng-portal">
            {children}
        </div>
    );
}
