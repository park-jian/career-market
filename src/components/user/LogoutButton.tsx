import {useLogout} from '../../hooks/useAuth';
const LogoutButton: React.FC<{ className: string }> = ({ className }) => {
    const logoutMutation = useLogout();
    
    return (
      <button 
        onClick={() => logoutMutation.mutate()} 
        className={className}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
      </button>
    );
  };
export default LogoutButton;